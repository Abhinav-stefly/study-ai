import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSend(text);
        setText("");
      }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask something..."
      />
      <button>Send</button>
    </form>
  );
}
