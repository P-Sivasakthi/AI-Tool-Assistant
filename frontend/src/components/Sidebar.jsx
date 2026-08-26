import {
  AddRounded,
  AccessTimeRounded,
  CalculateRounded,
  ChatBubbleOutlineRounded,
  CloudRounded,
  SmartToyRounded
} from "@mui/icons-material";

import {
  Avatar,
  Box,
  Button,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Typography
} from "@mui/material";

const tools = [
  {
    id: "weather",
    name: "Weather",
    description: "Get current weather",
    color: "#e8f0ff"
  },
  {
    id: "calculator",
    name: "Calculator",
    description: "Perform math operations",
    color: "#e8fbf0"
  },
  {
    id: "time",
    name: "Time",
    description: "Get current date & time",
    color: "#fff3e4"
  }
];

const toolIcons = {
  weather: <CloudRounded />,
  calculator: <CalculateRounded />,
  time: <AccessTimeRounded />
};

export default function Sidebar({
  chats,
  selectedChat,
  onSelectChat,
  onNewChat
}) {
  return (
    <Box className="sidebar">

      <Box className="brand">
        <Box className="brand-icon">
          <SmartToyRounded />
        </Box>

        <Box>
          <Typography className="brand-title">
            AI Tool Assistant
          </Typography>
        </Box>
      </Box>

      <Button
        fullWidth
        variant="contained"
        startIcon={<AddRounded />}
        onClick={onNewChat}
        className="new-chat-button"
      >
        New Chat
      </Button>

      <Typography className="section-label">
        CHATS
      </Typography>

      <List disablePadding className="chat-list">

        {chats.length === 0 ? (
          <Typography
            sx={{
              px: 2,
              py: 2,
              fontSize: 12,
              color: "text.secondary"
            }}
          >
            No conversations yet
          </Typography>
        ) : (
          chats.map((chat) => (
            <ListItemButton
              key={chat.id}
              selected={selectedChat === chat.id}
              onClick={() => onSelectChat(chat.id)}
              className="chat-item"
            >
              <ChatBubbleOutlineRounded
                className="chat-item-icon"
              />

              <ListItemText
                primary={chat.title}
                secondary={chat.time}
                primaryTypographyProps={{
                  noWrap: true,
                  fontSize: 13,
                  fontWeight: 600
                }}
                secondaryTypographyProps={{
                  noWrap: true,
                  fontSize: 11
                }}
              />
            </ListItemButton>
          ))
        )}

      </List>

      <Typography className="section-label tools-label">
        TOOLS
      </Typography>

      <Box className="tool-list">
        {tools.map((tool) => (
          <Box className="tool-item" key={tool.id}>

            <Box
              className="tool-icon"
              sx={{
                backgroundColor: tool.color
              }}
            >
              {toolIcons[tool.id]}
            </Box>

            <Box>
              <Typography className="tool-name">
                {tool.name}
              </Typography>

              <Typography className="tool-description">
                {tool.description}
              </Typography>
            </Box>

          </Box>
        ))}
      </Box>

      <Box className="profile-card">
        <Avatar
          sx={{
            bgcolor: "#d94e72",
            width: 36,
            height: 36
          }}
        >
          S
        </Avatar>

        <Box sx={{ minWidth: 0 }}>
          <Typography className="profile-name">
            Sakthi
          </Typography>

          <Typography
            className="profile-email"
            noWrap
          >
            sakthi@gamil.com
          </Typography>
        </Box>

        <IconButton
          size="small"
          sx={{
            color: "#fff",
            ml: "auto"
          }}
        >
          <span style={{ fontSize: 18 }}>
            ⌄
          </span>
        </IconButton>
      </Box>

    </Box>
  );
}