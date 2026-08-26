import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 30000
});

export async function sendChatMessage(message) {
  const { data } = await api.post("/api/chat", {
    message
  });

  return data;
}

export default api;
