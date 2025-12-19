export default function MCQ({ data = [] }) {
  if (!Array.isArray(data)) data = [];
  return (
    <div style={{display:'grid',gap:12}}>
      {data.map((q, idx) => (
        <div className="qa-card" key={q.id || idx}>
          <div className="qa-question">{q.question}</div>
          <div style={{display:'grid',gap:8}}>
            {(q.options || []).map((opt, i) => (
              <div key={i} className="qa-answer">{String.fromCharCode(65 + i)}. {opt}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
