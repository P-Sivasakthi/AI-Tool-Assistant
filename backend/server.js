import "dotenv/config";
import express from "express";
import cors from "cors";
import { runAgent } from "./src/agent.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(",").map((value) => value.trim())
      : true
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    service: "ai-tool-assistant-backend"
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        error: "message is required"
      });
    }

    const result = await runAgent(message);

    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error("POST /api/chat error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to process the AI request"
    });
  }
});

app.listen(PORT, () => {
  console.log(`AI backend running at http://localhost:${PORT}`);
});
