function WordDisplay({ word, guessed }) {
  return (
    <div className="word-display">
      {word.split("").map((letter, index) => (
        <span key={index} className="letter-box">
          {guessed.includes(letter) ? letter.toUpperCase() : "_"}
        </span>
      ))}
    </div>
  )
}

export default WordDisplay