import WordDisplay from "./WordDisplay"

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("")

function Game({ gameState, gameOver, roomCode, playerName, onGuess, notification }) {
  if (!gameState) {
    return (
      <div className="waiting">
        <h1 className="logo">DEAD<span>LEX</span></h1>
        <p>Room Code: <strong>{roomCode}</strong></p>
        <p>Waiting for players to join...</p>
        <p className="hint">Share the room code with a friend!</p>
      </div>
    )
  }

  const currentPlayer = gameState.players[gameState.currentTurn % gameState.players.length]
  const isMyTurn = currentPlayer?.id === undefined ? false : currentPlayer.name === playerName

  return (
    <div className="game">
      <h1 className="logo">DEAD<span>LEX</span></h1>

      <div className="room-info">
        <span>Room: <strong>{roomCode}</strong></span>
        <span>Wrong: <strong>{gameState.wrongGuesses}/{gameState.maxWrong}</strong></span>
      </div>

      {notification && <div className="notification">{notification}</div>}

      {gameOver ? (
        <div className="game-over">
          {gameOver.winner ? (
            <h2>🏆 {gameOver.winner} wins!</h2>
          ) : (
            <h2>💀 Nobody survived. The word was: <span>{gameOver.word.toUpperCase()}</span></h2>
          )}
          <p>Refresh the page to play again</p>
        </div>
      ) : (
        <>
          <div className="turn-info">
            {isMyTurn ? (
              <p className="your-turn">⚡ Your turn!</p>
            ) : (
              <p>{currentPlayer?.name}'s turn</p>
            )}
          </div>

          <WordDisplay word={gameState.word} guessed={gameState.guessed} />

          <div className="guessed-letters">
            {gameState.guessed.length > 0 && (
              <p>Guessed: {gameState.guessed.join(", ").toUpperCase()}</p>
            )}
          </div>

          <div className="keyboard">
            {ALPHABET.map((letter) => (
              <button
                key={letter}
                onClick={() => isMyTurn && onGuess(letter)}
                disabled={gameState.guessed.includes(letter) || !isMyTurn}
                className={
                  gameState.guessed.includes(letter)
                    ? gameState.word.includes(letter)
                      ? "correct"
                      : "wrong"
                    : ""
                }
              >
                {letter.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="players">
            <p>Players:</p>
            {gameState.players.map((p, i) => (
              <span key={i} className={p.name === playerName ? "me" : ""}>
                {p.name} {p.name === currentPlayer?.name ? "⚡" : ""}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Game