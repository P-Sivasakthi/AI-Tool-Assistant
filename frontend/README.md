# AI Tool Assistant - React Frontend

## Stack
- React.js
- Vite
- Material UI
- React Router
- Axios

## Backend connection

The frontend calls:

`POST http://localhost:5000/api/chat`

Request:

```json
{
  "message": "What's the weather in Chennai?"
}
```

Minimum expected response:

```json
{
  "response": "The current weather in Chennai is 32°C."
}
```

To display tool execution details, the backend can additionally return:

```json
{
  "response": "The current weather in Chennai is 32°C.",
  "toolCall": {
    "name": "get_weather",
    "subtitle": "Fetching weather for: Chennai",
    "input": {
      "city": "Chennai"
    },
    "result": {
      "city": "Chennai",
      "temperature": 32,
      "condition": "Partly Cloudy"
    },
    "duration": "742ms"
  }
}
```

For multiple tool calls, return:

```json
{
  "response": "Here are the results...",
  "toolCalls": [
    {
      "name": "get_weather",
      "input": { "city": "Chennai" },
      "result": { "temperature": 32 },
      "duration": "742ms"
    },
    {
      "name": "calculator",
      "input": { "a": 25, "b": 20, "operation": "multiply" },
      "result": 500,
      "duration": "125ms"
    }
  ]
}
```

## Run

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` if the backend is not running on port 5000.
