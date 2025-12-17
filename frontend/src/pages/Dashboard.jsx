import { useEffect, useState } from "react";
import UploadDocument from "../components/documents/UploadDocument";
import DocumentList from "../components/documents/DocumentList";
import { getDocuments } from "../api/document.api";

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    const docs = await getDocuments();
    if (Array.isArray(docs)) return setDocuments(docs);
    if (docs && Array.isArray(docs.documents)) return setDocuments(docs.documents);
    console.warn("Dashboard.loadDocs: unexpected getDocuments result:", docs);
    setDocuments([]);
  };

  return (
    <>
      <UploadDocument onUploadSuccess={loadDocs} />
      <DocumentList documents={documents} />
    </>
  );
}
