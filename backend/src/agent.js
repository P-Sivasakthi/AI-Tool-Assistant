import { ChatGroq } from "@langchain/groq";
import {
  StateGraph,
  Annotation,
  MessagesAnnotation
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { z } from "zod";

import { calculatorTool } from "./tools/calculator.js";
import { timeTool } from "./tools/time.js";
import { weatherTool } from "./tools/weather.js";

// ======================================================
// TOOLS
// ======================================================

const tools = [
  weatherTool,
  calculatorTool,
  timeTool
];

// ======================================================
// MAIN LLM
// ======================================================

const llm = new ChatGroq({
  model: process.env.GROQ_MODEL,
  temperature: 0,
  apiKey: process.env.GROQ_API_KEY
});

// Main LLM with tools
const llmWithTools = llm.bindTools(tools);

// ======================================================
// ROUTER LLM
// ======================================================

const RouteSchema = z.object({
  route: z.enum([
    "weather",
    "time",
    "calculator",
    "unsupported"
  ])
});

const routerLLM = llm.withStructuredOutput(RouteSchema);

// ======================================================
// GRAPH STATE
// ======================================================

const GraphState = Annotation.Root({
  messages: MessagesAnnotation.spec.messages,

  route: Annotation({
    reducer: (_, value) => value,
    default: () => null
  })
});

// ======================================================
// ROUTER NODE
// ======================================================

async function routerNode(state) {
  const lastMessage =
    state.messages[state.messages.length - 1];

  console.log("\n========== ROUTER ==========");
  console.log("User question:", lastMessage.content);

  const response = await routerLLM.invoke([
    {
      role: "system",
      content: `
You are a request router.

Your ONLY job is to classify the user's request.

Available routes:

1. weather
Use this route for:
- weather
- current weather
- temperature
- rain
- humidity
- wind
- weather conditions
- forecast
- questions like "Do I need an umbrella in Chennai?"

2. time
Use this route for:
- current time
- current date
- time in a city
- time in a timezone

3. calculator
Use this route for:
- mathematical calculations
- addition
- subtraction
- multiplication
- division
- percentages
- arithmetic expressions

4. unsupported
Use this route for anything unrelated to weather,
time, or mathematical calculations.

Examples:

"Weather in Chennai" -> weather

"Will it rain in Chennai?" -> weather

"What is the temperature in Bangalore?" -> weather

"What time is it in London?" -> time

"What is the current date?" -> time

"What is 25 * 50?" -> calculator

"Calculate 100 / 5" -> calculator

"What is React?" -> unsupported

"Tell me a joke" -> unsupported

"Who is Elon Musk?" -> unsupported

Return ONLY the structured route.
`
    },
    {
      role: "user",
      content: lastMessage.content
    }
  ]);

  console.log("Router result:", response);

  return {
    route: response.route
  };
}

// ======================================================
// ROUTING FUNCTION
// ======================================================

function routeRequest(state) {
  console.log("Selected route:", state.route);

  return state.route;
}

// ======================================================
// MAIN LLM NODE
// ======================================================

async function callModel(state) {
  console.log("\n========== AGENT ==========");
  console.log("State:", state);

  const response = await llmWithTools.invoke(
    state.messages
  );

  console.log("LLM response:", response);

  return {
    messages: [response]
  };
}

// ======================================================
// TOOL NODE
// ======================================================

const toolNode = new ToolNode(tools);

// ======================================================
// TOOL ROUTING AFTER MAIN LLM
// ======================================================

function shouldContinue(state) {
  const lastMessage =
    state.messages[state.messages.length - 1];

  console.log("\n========== TOOL CHECK ==========");

  if (lastMessage.tool_calls?.length) {
    console.log(
      "Tool calls detected:",
      lastMessage.tool_calls
    );

    return "tools";
  }

  console.log("No tool calls.");

  return "__end__";
}

// ======================================================
// REJECT NODE
// ======================================================

function rejectRequest() {
  console.log("\n========== REJECT ==========");

  return {
    messages: [
      {
        role: "assistant",
        content: "I can only assist with tool-related queries. Your query is not related to the tools I support."
      }
    ]
  };
}

// ======================================================
// GRAPH
// ======================================================

const graph = new StateGraph(GraphState)

  // -----------------------------
  // Nodes
  // -----------------------------

  .addNode("router", routerNode)

  .addNode("agent", callModel)

  .addNode("tools", toolNode)

  .addNode("reject", rejectRequest)

  // -----------------------------
  // START
  // -----------------------------

  .addEdge(
    "__start__",
    "router"
  )

  // -----------------------------
  // ROUTER
  // -----------------------------

  .addConditionalEdges(
    "router",
    routeRequest,
    {
      weather: "agent",
      time: "agent",
      calculator: "agent",
      unsupported: "reject"
    }
  )

  // -----------------------------
  // AGENT → TOOL / END
  // -----------------------------

  .addConditionalEdges(
    "agent",
    shouldContinue,
    {
      tools: "tools",
      __end__: "__end__"
    }
  )

  // -----------------------------
  // TOOL → AGENT
  // -----------------------------

  .addEdge(
    "tools",
    "agent"
  )

  // -----------------------------
  // REJECT → END
  // -----------------------------

  .addEdge(
    "reject",
    "__end__"
  )

  .compile();

// ======================================================
// TOOL RESULT NORMALIZATION
// ======================================================

function normalizeToolResult(content) {
  if (typeof content !== "string") {
    return content;
  }

  try {
    return JSON.parse(content);
  } catch {
    return content;
  }
}

// ======================================================
// RUN AGENT
// ======================================================

export async function runAgent(userMessage) {
  console.log("\n\n=================================");
  console.log("RUN AGENT");
  console.log("User:", userMessage);
  console.log("=================================");

  const result = await graph.invoke({
    messages: [
      {
        role: "user",
        content: userMessage
      }
    ]
  });

  const messages = result.messages;

  const finalMessage =
    messages[messages.length - 1];

  // ==========================================
  // COLLECT TOOL CALLS
  // ==========================================

  const toolCalls = [];

  let pendingToolCalls = new Map();

  for (const message of messages) {

    // ------------------------------------------
    // AIMessage containing tool calls
    // ------------------------------------------

    if (message.tool_calls?.length) {

      for (const call of message.tool_calls) {

        pendingToolCalls.set(
          call.id,
          {
            id: call.id,
            name: call.name,
            input: call.args
          }
        );
      }
    }

    // ------------------------------------------
    // ToolMessage
    // ------------------------------------------

    if (
      message.constructor?.name === "ToolMessage" ||
      message.tool_call_id
    ) {

      const match =
        pendingToolCalls.get(
          message.tool_call_id
        );

      toolCalls.push({
        name:
          match?.name ||
          message.name ||
          "tool",

        input:
          match?.input ||
          {},

        result:
          normalizeToolResult(
            message.content
          )
      });

      if (message.tool_call_id) {
        pendingToolCalls.delete(
          message.tool_call_id
        );
      }
    }
  }

  // ==========================================
  // FINAL RESPONSE
  // ==========================================

  let response;

  if (typeof finalMessage.content === "string") {
    response = finalMessage.content;
  } else {
    response = JSON.stringify(
      finalMessage.content
    );
  }

  console.log("\n========== FINAL ==========");
  console.log("Response:", response);
  console.log("Tool calls:", toolCalls);

  return {
    response,
    toolCalls
  };
}