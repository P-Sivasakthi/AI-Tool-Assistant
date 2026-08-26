import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const calculatorTool = tool(
  async ({ a, b, operation }) => {
    switch (operation) {
      case "add":
        return String(a + b);
      case "subtract":
        return String(a - b);
      case "multiply":
        return String(a * b);
      case "divide":
        return b === 0 ? "Cannot divide by zero" : String(a / b);
      default:
        return "Invalid operation";
    }
  },
  {
    name: "calculator",
    description:
      "Perform addition, subtraction, multiplication, or division.",
    schema: z.object({
      a: z.number(),
      b: z.number(),
      operation: z.enum(["add", "subtract", "multiply", "divide"])
    })
  }
);
