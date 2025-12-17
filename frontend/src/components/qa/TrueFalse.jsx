export default function TrueFalse({ data = [] }) {
  if (!Array.isArray(data)) data = [];
  return (
    <div>
      <h3>True / False</h3>
      {data.map((q) => (
        <p key={q.id}>
          {q.statement} → <b>{q.answer}</b>
        </p>
      ))}
    </div>
  );
}
