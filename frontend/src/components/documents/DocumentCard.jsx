import { Link } from "react-router-dom";

export default function DocumentCard({ doc }) {
  return (
    <div>
      <h3>{doc.originalName}</h3>
      <Link to={`/document/${doc._id}`}>View</Link>
    </div>
  );
}
