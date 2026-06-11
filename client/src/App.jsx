import { useState, useEffect } from "react"
import { io } from "socket.io-client"
import Lobby from "./components/Lobby"
import Game from "./components/Game"
import "./App.css"

const socket = io("http://localhost:3001")

function App() {
  const [screen, setScreen] = useState("lobby")
  const [roomCode, setRoomCode] = useState("")
  const [playerName, setPlayerName] = useState("")
  const [gameState, setGameState] = useState(null)
  const [gameOver, setGameOver] = useState(null)
  const [notification, setNotification] = useState("")

  useEffect(() => {
    socket.on("roomCreated", ({ roomCode }) => {
      setRoomCode(roomCode)
      setScreen("game")
    })

    socket.on("gameState", (state) => {
      setGameState(state)
      setGameOver(null)
    })

    socket.on("playerJoined", ({ playerName }) => {
      setNotification(`${playerName} joined the game!`)
      setTimeout(() => setNotification(""), 3000)
    })

    socket.on("gameOver", ({ winner, word }) => {
      setGameOver({ winner, word })
    })

    socket.on("error", ({ message }) => {
      alert(message)
    })

    return () => {
      socket.off("roomCreated")
      socket.off("gameState")
      socket.off("playerJoined")
      socket.off("gameOver")
      socket.off("error")
    }
  }, [])

  const createRoom = (name) => {
    setPlayerName(name)
    socket.emit("createRoom", { playerName: name })
  }

  const joinRoom = (name, code) => {
    setPlayerName(name)
    setRoomCode(code)
    socket.emit("joinRoom", { playerName: name, roomCode: code })
    setScreen("game")
  }

  const guessLetter = (letter) => {
    socket.emit("guessLetter", { letter, roomCode })
  }

  return (
    <div className="app">
      {screen === "lobby" ? (
        <Lobby onCreateRoom={createRoom} onJoinRoom={joinRoom} />
      ) : (
        <Game
          gameState={gameState}
          gameOver={gameOver}
          roomCode={roomCode}
          playerName={playerName}
          onGuess={guessLetter}
          notification={notification}
        />
      )}
    </div>
  )
}

export default App