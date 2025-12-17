import useDocuments from "../../hooks/useDocuments";
import DocumentCard from "./DocumentCard";

export default function DocumentList({ documents: docsProp }) {
  const contextDocs = useDocuments();
  let documents = docsProp ?? contextDocs ?? [];

  // handle unexpected shapes like { documents: [...] }
  if (!Array.isArray(documents) && documents && Array.isArray(documents.documents)) {
    documents = documents.documents;
  }

  if (!Array.isArray(documents)) {
    console.warn("DocumentList: documents is not an array", documents);
    documents = [];
  }

  return (
    <div>
      {documents.map(doc => (
        <DocumentCard key={doc._id} doc={doc} />
      ))}
    </div>
  );
}
