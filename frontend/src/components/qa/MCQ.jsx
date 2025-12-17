export default function MCQ({ data = [] }) {
  if (!Array.isArray(data)) data = [];
  return (
    <div>
      <h3>MCQs</h3>
      {data.map((q) => (
        <div key={q.id}>
          <p>{q.question}</p>
          <ul>
            {(q.options || []).map((opt, i) => (
              <li key={i}>{opt}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
