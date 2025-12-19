import { useEffect, useState } from "react";
import UploadDocument from "../components/documents/UploadDocument";
import DocumentList from "../components/documents/DocumentList";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
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
      <Header />
      <div className="page-container">
        <div className="page-header">
          <div>
            <div className="page-title">Your Documents</div>
            <div className="page-sub">Browse, chat with, and study your uploaded documents.</div>
          </div>

          <div className="stats">
            <div className="stat">Total: {documents?.length ?? 0}</div>
            <UploadDocument onUploadSuccess={loadDocs} />
          </div>
        </div>

        <div className="card" style={{marginTop:12}}>
          <h3 style={{marginBottom:8}}>How DocAI helps you study</h3>
          <p style={{color:'#94a3b8'}}>
            Upload lecture notes, slides or textbook pages and DocAI extracts text, creates a concise summary, generates flashcards and
            different question types (MCQ, True/False, Fill-ups, Short & Long answers) so you can review and practice efficiently.
            Use the Chat to ask targeted questions about your document.
          </p>
        </div>

        <div className="doc-grid">
          {documents && documents.length > 0 ? (
            <DocumentList documents={documents} />
          ) : (
            <div className="card">No documents yet — upload one to get started.</div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
