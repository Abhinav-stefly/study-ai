import { useState } from "react";
import { useParams } from "react-router-dom";
import { chatWithDoc } from "../api/chat.api";

export default function ChatPage() {
  const { id: docId } = useParams();
  const [q, setQ] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!q.trim()) return;

    setLoading(true);

    try {
      const res = await chatWithDoc(docId, q);

      // ✅ IMPORTANT: extract answer string
      const answerText = res.data.answer;

      setMessages(prev => [
        ...prev,
        { q, a: answerText }
      ]);
    } catch (err) {
      console.error("Chat send failed", err);
      setMessages(prev => [
        ...prev,
        { q, a: "Failed to get response" }
      ]);
    } finally {
      setLoading(false);
      setQ("");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat with Document</h2>

      {messages.map((m, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <p><b>You:</b> {m.q}</p>
          <p><b>AI:</b> {m.a}</p>
        </div>
      ))}

      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Ask from document..."
        style={{ width: "70%", marginRight: 10 }}
      />

      <button onClick={send} disabled={loading}>
        {loading ? "Thinking..." : "Ask"}
      </button>
    </div>
  );
}
