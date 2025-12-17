import ChatMessage from "./ChatMessage";

export default function ChatBox({ messages }) {
  return (
    <div>
      {messages.map((m, i) => (
        <ChatMessage key={i} message={m} />
      ))}
    </div>
  );
}
