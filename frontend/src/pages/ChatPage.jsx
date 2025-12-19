import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { chatWithDoc } from "../api/chat.api";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

export default function ChatPage() {
  const { id: docId } = useParams();
  const [q, setQ] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);
  const [error, setError] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async () => {
    if (!q.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await chatWithDoc(docId, q);
      setLastResponse(res?.data ?? null);

      const answerPayload = res?.data?.answer;
      let answerText =
        typeof answerPayload === "string"
          ? answerPayload
          : answerPayload?.answer ?? JSON.stringify(answerPayload ?? res?.data);

      answerText = String(answerText ?? "").trim();
      if (!answerText) answerText = "(No answer)";

      setMessages(prev => [
        ...prev,
        { from: "user", text: q },
        { from: "ai", text: answerText }
      ]);
    } catch (err) {
      const respMsg = err?.response?.data?.message || err?.response?.data || err.message || "Request failed";
      setError(respMsg);
      setMessages(prev => [
        ...prev,
        { from: "user", text: q },
        { from: "ai", text: String(respMsg) }
      ]);
    } finally {
      setLoading(false);
      setQ("");
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <>
      <Header />
      <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
          <h2 style={{ margin: 0 }}>Chat with Document</h2>
          <div style={{display:'flex',gap:8}}>
            <button className="btn-ghost" onClick={clearChat}>Clear</button>
            <button className="btn-ghost" onClick={() => window.location.reload()}>Reload</button>
          </div>
        </div>

        <div
          ref={listRef}
          style={{
            minHeight: 240,
            maxHeight: 480,
            overflowY: "auto",
            padding: 12,
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            background: "#fafafa",
            marginBottom: 12
          }}
        >
          {messages.length === 0 && (
            <p style={{ color: "#6b7280" }}>No messages yet — ask something about the document.</p>
          )}

          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", marginBottom: 10, justifyContent: m.from === "ai" ? "flex-start" : "flex-end" }}>
              <div style={{
                maxWidth: "78%",
                padding: 12,
                borderRadius: 10,
                background: m.from === "ai" ? "#fff" : "#0ea5e9",
                color: m.from === "ai" ? "#111" : "#fff",
                boxShadow: "0 4px 14px rgba(2,6,23,0.08)",
                lineHeight: 1.4
              }}>
                <div style={{ fontSize: 12, opacity: 0.85, fontWeight:700 }}>{m.from === "user" ? "You" : "AI"}</div>
                <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{m.text}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Ask from document..."
            style={{ flex: 1, padding: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
            onKeyDown={e => { if (e.key === "Enter") send(); }}
            disabled={loading}
          />

          <button onClick={send} disabled={loading || !q.trim()} className="btn-primary" style={{ padding: "10px 14px" }}>
            {loading ? "Thinking..." : "Ask"}
          </button>
        </div>

        {error && <p style={{ color: "#dc2626" }}>{error}</p>}

        <details style={{ marginTop: 12, background: "#fff", padding: 10, borderRadius: 8 }}>
          <summary style={{ cursor: "pointer" }}>Debug: last API response</summary>
          <pre style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{JSON.stringify(lastResponse, null, 2)}</pre>
        </details>
      </div>
      <Footer />
    </>
  );
}
