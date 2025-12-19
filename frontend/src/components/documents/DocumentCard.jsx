import { Link } from "react-router-dom";

export default function DocumentCard({ doc }) {
  const created = new Date(doc.createdAt || doc.uploadedAt || Date.now()).toLocaleDateString();
  const size = doc.size ? `${Math.round(doc.size / 1024)} KB` : "-";

  const hasImage = doc.fileType?.startsWith?.("image") || /\.(jpe?g|png|gif|webp|svg)$/i.test(doc.fileUrl || "");

  return (
    <div className="doc-card">
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        {hasImage && <img src={doc.fileUrl} alt="doc thumb" className="doc-thumb" />}
        <div>
          <div className="doc-title">{doc.originalName}</div>
          <div className="doc-meta">{doc.sheetName ?? doc.type ?? "Document"} • {created} • {size}</div>
        </div>
      </div>

      <div className="doc-actions">
        <Link className="btn-ghost" to={`/document/${doc._id}`}>View</Link>
        <Link className="btn-primary" to={`/chat/${doc._id}`}>Chat</Link>
        <Link className="btn-ghost" to={`/study/${doc._id}`}>Study</Link>
      </div>
    </div>
  );
}
