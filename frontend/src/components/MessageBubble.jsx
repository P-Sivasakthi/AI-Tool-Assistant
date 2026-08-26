import { Avatar, Box, Typography } from "@mui/material";
import ToolCard from "./ToolCard";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <Box className={`message-row ${isUser ? "user-row" : "assistant-row"}`}>
      {!isUser && <Avatar className="assistant-avatar">AI</Avatar>}

      <Box className={isUser ? "user-message" : "assistant-message"}>
        <Typography className="message-text">{message.text}</Typography>

        {message.tool && (
          <ToolCard tool={message.tool} />
        )}

        <Typography className="message-time">
          {message.time}
        </Typography>
      </Box>
    </Box>
  );
}