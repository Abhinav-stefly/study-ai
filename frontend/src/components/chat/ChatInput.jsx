export default function ChatMessage({ message }) {
  return (
    <p>
      <strong>{message.role}:</strong> {message.text}
    </p>
  );
}
