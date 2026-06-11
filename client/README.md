# DeadLex

Built this because I wanted to understand how real-time communication actually works under the hood — not just read about it.

DeadLex is a multiplayer word guessing game that runs in the browser. Players create rooms, share a code, and take turns guessing letters in real-time. No page refreshes. No polling. Just persistent socket connections doing the work.

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Real-time layer:** Socket.io (WebSockets)
- **Styling:** Custom CSS

## Architecture

The server maintains game state for each room in memory. When a player guesses a letter, the event is emitted to the server via Socket.io, validated server-side, and the updated game state is broadcast to all players in that room instantly.

## Running locally

```bash
# Server
cd server
npm install
node index.js

# Client (new terminal)
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. Open a second tab to test multiplayer.

## Roadmap

Active development in progress. See [ROADMAP.md](./ROADMAP.md) for upcoming features.

---

Built by Jahnavi S T · [LinkedIn](https://www.linkedin.com/in/jahnavi-s-t/) · [GitHub](https://github.com/jahnavist04)