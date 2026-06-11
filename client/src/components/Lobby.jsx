import { useState } from "react"

function Lobby({ onCreateRoom, onJoinRoom }) {
  const [name, setName] = useState("")
  const [roomCode, setRoomCode] = useState("")
  const [mode, setMode] = useState(null)

  const handleCreate = () => {
    if (!name.trim()) return alert("Enter your name!")
    onCreateRoom(name)
  }

  const handleJoin = () => {
    if (!name.trim()) return alert("Enter your name!")
    if (!roomCode.trim()) return alert("Enter a room code!")
    onJoinRoom(name, roomCode.toUpperCase())
  }

  return (
    <div className="lobby">
      <h1 className="logo">DEAD<span>LEX</span></h1>
      <p className="tagline">The code works. The bugs? We don't talk about them.</p>

      <div className="input-group">
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={15}
        />
      </div>

      {!mode && (
        <div className="button-group">
          <button onClick={() => setMode("create")}>Create Room</button>
          <button onClick={() => setMode("join")}>Join Room</button>
        </div>
      )}

      {mode === "create" && (
        <div className="mode-box">
          <p>Share the room code with your friends after creating!</p>
          <button onClick={handleCreate}>Generate Room</button>
          <button className="back" onClick={() => setMode(null)}>Back</button>
        </div>
      )}

      {mode === "join" && (
        <div className="mode-box">
          <input
            type="text"
            placeholder="Enter room code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            maxLength={5}
          />
          <button onClick={handleJoin}>Join Game</button>
          <button className="back" onClick={() => setMode(null)}>Back</button>
        </div>
      )}
    </div>
  )
}

export default Lobby