export default function ShortQA({ data = [] }) {
  if (!Array.isArray(data)) data = [];
  return (
    <div style={{display:'grid',gap:12}}>
      {data.map((q, idx) => (
        <div className="qa-card" key={q.id || idx}>
          <div className="qa-question">{q.question}</div>
          <div className="qa-answer">{q.answer}</div>
        </div>
      ))}
    </div>
  );
}
