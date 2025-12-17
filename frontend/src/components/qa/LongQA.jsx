export default function LongQA({ data = [] }) {
  if (!Array.isArray(data)) data = [];
  return (
    <div>
      <h3>Long Answer</h3>
      {data.map((q) => (
        <div key={q.id}>
          <p><b>{q.question}</b></p>
          <p>{q.answer}</p>
        </div>
      ))}
    </div>
  );
}
