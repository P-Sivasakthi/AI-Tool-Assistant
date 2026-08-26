import { useState } from "react";
import {
  AttachFileRounded,
  MoreVertRounded,
  OpenInFullRounded,
  SendRounded,
  ShareRounded
} from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  InputBase,
  Paper,
  Tooltip,
  Typography
} from "@mui/material";
import MessageBubble from "../components/MessageBubble";
import ExecutionPanel from "../components/ExecutionPanel";
import { sendChatMessage } from "../services/api";

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function ChatPage({
  title,
  messages,
  setMessages,
  executionLogs,
  setExecutionLogs,
  onFirstMessage
}) {
  const [input, setInput] = useState("");
  const [showExecution, setShowExecution] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    const value = input.trim();

    if (!value || loading) return;

    const isFirstMessage = messages.length === 0;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: value,
      time: getTime()
    };

    setMessages((prev) => [
      ...prev,
      userMessage
    ]);

    if (isFirstMessage && onFirstMessage) {
      onFirstMessage(value);
    }

    setInput("");
    setError("");
    setLoading(true);

    try {
      const data = await sendChatMessage(value);

      const assistantMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        text:
          data.response ||
          data.message ||
          "The backend returned an empty response.",
        time: getTime()
      };

      setMessages((prev) => [
        ...prev,
        assistantMessage
      ]);

      if (Array.isArray(data.toolCalls)) {

        setExecutionLogs((prev) => [
          ...prev,
          ...data.toolCalls.map((tool, index) => ({
            id: crypto.randomUUID(),
            name: tool.name,
            input: tool.input,
            result: tool.result,
            time: getTime(),
            duration: tool.duration || "-"
          }))
        ]);
      }

    } catch (err) {

      setError(
        err.message ||
        "Unable to connect to the backend."
      );

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text:
            "Sorry, I couldn't connect to the AI backend.",
          time: getTime()
        }
      ]);

    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="chat-layout">
      <Box className="chat-main">
        <Box className="chat-header">
          <Box>
            <Typography className="chat-title">{title}</Typography>
            <Typography className="chat-status">
              AI agent • 3 tools available
            </Typography>
          </Box>

          <Box className="header-actions">
            <Tooltip title="Share">
              <IconButton className="header-button">
                <ShareRounded />
              </IconButton>
            </Tooltip>

            <IconButton className="header-button">
              <MoreVertRounded />
            </IconButton>

            <Tooltip title="Toggle tool execution">
              <IconButton
                className="header-button"
                onClick={() => setShowExecution((value) => !value)}
              >
                <OpenInFullRounded />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box className="messages-container">
          <Box className="messages-inner">
            {messages.length === 0 && (
              <Box className="empty-chat">
                <Typography className="empty-chat-title">
                  AI Tool Assistant
                </Typography>
                <Typography className="empty-chat-text">
                  Ask about weather, calculations, time, or anything else.
                </Typography>
              </Box>
            )}

            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
              />
            ))}

            {loading && (
              <Box className="message-row assistant-row">
                <Box className="assistant-avatar">AI</Box>
                <Box className="typing-indicator">
                  <CircularProgress size={14} />
                  <Typography>AI is thinking...</Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        <Box className="composer-wrap">
          {error && (
            <Typography className="api-error">
              {error}
            </Typography>
          )}

          <Paper className="composer" elevation={0}>
            <InputBase
              fullWidth
              value={input}
              disabled={loading}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask me anything..."
              multiline
              maxRows={4}
            />

            <IconButton className="attach-button" disabled>
              <AttachFileRounded />
            </IconButton>

            <IconButton
              className="send-button"
              disabled={loading || !input.trim()}
              onClick={handleSend}
            >
              {loading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <SendRounded />
              )}
            </IconButton>
          </Paper>

          <Typography className="disclaimer">
            AI can make mistakes. Please verify important information.
          </Typography>
        </Box>
      </Box>

      {showExecution && (
        <ExecutionPanel
          logs={executionLogs}
          onClose={() => setShowExecution(false)}
          onClear={() => setExecutionLogs([])}
        />
      )}
    </Box>
  );
}