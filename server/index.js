const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

const words = [
  "python", "socket", "deadlex", "keyboard", "monitor",
  "network", "server", "client", "gaming", "hacker",
  "matrix", "binary", "cipher", "neural", "rocket"
]

const rooms = {}

function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)]
}

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id)

  // Create a room
  socket.on('createRoom', ({ playerName }) => {
    const roomCode = Math.random().toString(36).substring(2, 7).toUpperCase()
    const word = getRandomWord()
    
    rooms[roomCode] = {
      word,
      guessed: [],
      wrongGuesses: 0,
      maxWrong: 6,
      players: [{ id: socket.id, name: playerName }],
      currentTurn: 0,
      gameOver: false
    }

    socket.join(roomCode)
    socket.emit('roomCreated', { roomCode })
    io.to(roomCode).emit('gameState', rooms[roomCode])
    console.log(`Room ${roomCode} created with word: ${word}`)
  })

  // Join a room
  socket.on('joinRoom', ({ playerName, roomCode }) => {
    const room = rooms[roomCode]
    
    if (!room) {
      socket.emit('error', { message: 'Room not found!' })
      return
    }

    if (room.gameOver) {
      socket.emit('error', { message: 'Game already over!' })
      return
    }

    room.players.push({ id: socket.id, name: playerName })
    socket.join(roomCode)
    io.to(roomCode).emit('gameState', room)
    io.to(roomCode).emit('playerJoined', { playerName })
  })

  // Guess a letter
  socket.on('guessLetter', ({ letter, roomCode }) => {
    const room = rooms[roomCode]
    if (!room || room.gameOver) return

    // Check if it's this player's turn
    const currentPlayer = room.players[room.currentTurn % room.players.length]
    if (currentPlayer.id !== socket.id) return

    // Already guessed
    if (room.guessed.includes(letter)) return

    room.guessed.push(letter)

    if (!room.word.includes(letter)) {
      room.wrongGuesses++
    }

    // Check win
    const isWon = room.word.split('').every(l => room.guessed.includes(l))
    if (isWon) {
      room.gameOver = true
      io.to(roomCode).emit('gameOver', { winner: currentPlayer.name, word: room.word })
      return
    }

    // Check loss
    if (room.wrongGuesses >= room.maxWrong) {
      room.gameOver = true
      io.to(roomCode).emit('gameOver', { winner: null, word: room.word })
      return
    }

    // Next turn
    room.currentTurn++
    io.to(roomCode).emit('gameState', room)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

server.listen(3001, () => {
  console.log('DeadLex server running on port 3001')
})