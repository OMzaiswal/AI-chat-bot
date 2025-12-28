# AI Live Chat Support Agent

A mini AI-powered customer support chat application.

This project simulates a real-world live chat widget where an AI agent answers customer questions using a real LLM API, persists conversations, and gracefully handles failures.

---

## 🚀 Live Demo

- **Frontend:** [https://ai-chatbot.om108.work](https://ai-chatbot.om108.work/)  
- **Backend API:** https://api.ai-chatbot.om108.work  

---

## 🧱 Tech Stack

### Frontend
- React + TypeScript
- Axios
- Tailwind CSS (lightweight styling)
- Deployed on Vercel

### Backend
- Node.js + TypeScript
- Express
- Prisma ORM
- PostgreSQL (neon.tech)
- OpenAI API (LLM)
- Deployed on Railway

---

## ✨ Features

### Chat UI
- Scrollable live chat interface
- Clear distinction between **User** and **AI** messages
- Enter key & Send button support
- Auto-scroll to latest message
- Infinite scroll to load older messages
- “AI is typing…” indicator
- Disabled input during in-flight requests
- Graceful error messaging (network / backend / LLM failures)

### Backend API
- `POST /chat/message`
  - Accepts `{ message, sessionId? }`
  - Persists user + AI messages
  - Calls LLM and returns contextual replies
- `POST /chat/history`
  - Accepts `{ sessionId, cursor? }`
  - Cursor-based pagination
  - Fetches conversation history by session

### Persistence
- Conversations stored with session IDs
- Messages stored with sender, timestamp, and conversation reference
- Chat history restored on page reload

### LLM Integration
- Uses OpenAI API
- Prompted as a **helpful support agent for a fictional e-commerce store**
- Includes recent conversation history for context
- Handles API failures gracefully
- Basic cost control via limited history + token usage

---

## 🧠 Prompting & Domain Knowledge

The AI is seeded with fictional store information, including:
- Shipping policy
- Return & refund policy
- Support hours

This data is embedded directly in the system prompt to keep the implementation simple and deterministic.

Example system prompt:

> “You are a helpful support agent for a small e-commerce store. Answer clearly, concisely, and politely. Use the provided store policies when relevant.”

---

## 🗃️ Data Model

### Conversation
- `id`
- `sessionId`
- `createdAt`

### Message
- `id`
- `conversationId`
- `sender` (`User` | `AI`)
- `text`
- `createdAt`

---

## ⚙️ Running Locally

### 1. Clone the repository

This project uses `.env.example` files for environment configuration.  
Backend and frontend run as **separate apps** and must be started in **separate terminals**.

```bash
git clone https://github.com/OMzaiswal/AI-chat-bot.git
cd AI-chat-bot
```


### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env  #copy .env.example to .env
```
Update .env with your own values and setup prisma.
```bash
npx prisma migrate dev
npx prisma generate
```

Start the backend server
```bash
npm run dev
```
Backend will run at:
http://localhost:3000


### 3. Frontend Setup

Open a new terminal window:
```bash
cd frontend
npm install

cp .env.example .env   # copy .env.example to .env
```

Start the frontend
```bash
npm run dev
```

Frontend will run at:

http://localhost:5173


## 🔁 Trade-offs & “If I Had More Time…”

The chat currently uses HTTP requests; WebSockets could be added for true real-time communication.

There is no authentication — sessions are anonymous. Cookies or user accounts could be introduced for persistent, user-specific chats.

FAQ and store knowledge are kept minimal and prompt-based; this could be expanded into structured, store-backed data for more accurate and reliable support responses.


## 📝 Notes

- Run the backend and frontend in separate terminals.

- Ensure PostgreSQL is running before starting the backend.

- Copy .env.example → .env and fill in required values.

- If you change ports, update env files on both frontend and backend.

- .env files are not committed to the repository.



