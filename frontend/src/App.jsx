import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import ChatPage from "./pages/ChatPage";
import {
  Button
} from "@mui/material";

export default function App() {

  const [selectedChat, setSelectedChat] = useState(null);

  const [chats, setChats] = useState([]);

  const [executionLogs, setExecutionLogs] = useState({});

  // ------------------------------------------
  // Currently selected conversation
  // ------------------------------------------

  const selectedConversation = useMemo(() => {
    return chats.find(
      (chat) => chat.id === selectedChat
    );
  }, [chats, selectedChat]);

  // ------------------------------------------
  // Messages of selected conversation
  // ------------------------------------------

  const messages =
    selectedConversation?.messages || [];

  // ------------------------------------------
  // Update messages
  // ------------------------------------------

  const setMessages = (update) => {

    setChats((prevChats) =>
      prevChats.map((chat) => {

        if (chat.id !== selectedChat) {
          return chat;
        }

        const newMessages =
          typeof update === "function"
            ? update(chat.messages)
            : update;

        return {
          ...chat,
          messages: newMessages
        };
      })
    );
  };

  // ------------------------------------------
  // Create new chat
  // ------------------------------------------

  const handleNewChat = () => {

    const newChat = {
      id: crypto.randomUUID(),
      title: "New Chat",
      time: "Just now",
      messages: []
    };

    setChats((prev) => [
      newChat,
      ...prev
    ]);

    setSelectedChat(newChat.id);
  };

  // ------------------------------------------
  // Select existing chat
  // ------------------------------------------

  const handleSelectChat = (id) => {
    setSelectedChat(id);
  };

  // ------------------------------------------
  // Execution logs for current chat
  // ------------------------------------------

  const currentExecutionLogs =
    executionLogs[selectedChat] || [];

  const setCurrentExecutionLogs = (update) => {

    setExecutionLogs((prev) => {

      const current =
        prev[selectedChat] || [];

      const newLogs =
        typeof update === "function"
          ? update(current)
          : update;

      return {
        ...prev,
        [selectedChat]: newLogs
      };
    });
  };

  // ------------------------------------------
  // Generate title from first user message
  // ------------------------------------------

  const updateChatTitle = (message) => {

    if (!selectedChat) return;

    setChats((prevChats) =>
      prevChats.map((chat) => {

        if (chat.id !== selectedChat) {
          return chat;
        }

        // Don't overwrite an existing title
        if (
          chat.title !== "New Chat"
        ) {
          return chat;
        }

        return {
          ...chat,
          title:
            message.length > 35
              ? `${message.substring(0, 35)}...`
              : message,
          time: "Just now"
        };
      })
    );
  };

  return (
    <Box className="app-shell">

      <Sidebar
        chats={chats}
        selectedChat={selectedChat}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />

      <Box
        component="main"
        className="main-shell"
      >

        <Routes>

          <Route
            path="/"
            element={
              selectedConversation ? (
                <ChatPage
                  title={selectedConversation.title}
                  messages={messages}
                  setMessages={setMessages}
                  executionLogs={currentExecutionLogs}
                  setExecutionLogs={setCurrentExecutionLogs}
                  onFirstMessage={updateChatTitle}
                />
              ) : (
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleNewChat}
                  >
                    Start New Chat
                  </Button>
                </Box>
              )
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </Box>

    </Box>
  );
}