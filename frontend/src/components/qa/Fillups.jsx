export default function FillUps({ data = [] }) {
  if (!Array.isArray(data)) data = [];
  return (
    <div>
      <h3>Fill in the Blanks</h3>
      {data.map((q) => (
        <p key={q.id}>
          {q.question} → <b>{q.answer}</b>
        </p>
      ))}
    </div>
  );
}
