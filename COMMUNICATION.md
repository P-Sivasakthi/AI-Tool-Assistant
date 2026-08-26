# Frontend ↔ Backend Communication

## Architecture

React + MUI
  ↓ Axios
POST /api/chat
  ↓ REST API
Express / Node.js
  ↓
LangGraph
  ↓
LangChain ChatGroq
  ↓
Groq LLM
  ↓
Tool call
  ↓
Weather / Calculator / Time
  ↓
JSON response
  ↓ Axios
React UI

## Start backend

```bash
cd backend
npm install
copy .env.example .env
```

Set `GROQ_API_KEY` in `backend/.env`.

Then:

```bash
npm run dev
```

Backend:
`http://localhost:5000`

Health:
`GET http://localhost:5000/api/health`

Chat:
`POST http://localhost:5000/api/chat`

## Start frontend

From the project root:

```bash
npm install
copy .env.example .env
npm run dev
```

Frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Request

```json
{
  "message": "What's the weather in Chennai?"
}
```

## Response

```json
{
  "success": true,
  "response": "The current weather in Chennai is ...",
  "toolCalls": [
    {
      "name": "get_weather",
      "input": {
        "city": "Chennai"
      },
      "result": {
        "city": "Chennai, Tamil Nadu",
        "temperature": 32
      }
    }
  ]
}
```

The frontend uses `response` for the assistant message and `toolCalls` for the Tool Execution panel.
