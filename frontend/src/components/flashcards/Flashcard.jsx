import { useState } from "react";
import "./flashcard.css";

export default function FlashcardList({ front, back }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`flashcard ${flipped ? "flipped" : ""}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="flashcard-inner">
        {/* FRONT */}
        <div className="flashcard-front">
          <h4>Question</h4>
          <p>{front}</p>
        </div>

        {/* BACK */}
        <div className="flashcard-back">
          <h4>Answer</h4>
          <p>{back}</p>
        </div>
      </div>
    </div>
  );
}
