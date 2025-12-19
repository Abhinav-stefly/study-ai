import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDocumentById } from "../api/document.api";
import Loader from "../components/common/Loader";
import FlashcardList from "../components/flashcards/Flashcard";
import MCQ from "../components/qa/MCQ";
import FillUps from "../components/qa/FillUps";
import TrueFalse from "../components/qa/TrueFalse";
import ShortQA from "../components/qa/ShortQA";
import LongQA from "../components/qa/LongQA";
import Button from "../components/common/Button";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

export default function DocumentView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState('summary');

  useEffect(() => {
    async function fetchDoc() {
      try {
        const res = await getDocumentById(id);
        setDocument(res);
      } catch (err) {
        console.error("Failed to fetch document", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDoc();
  }, [id]);

  if (loading) return <Loader />;

  if (!document) {
    return (
      <>
        <Header />
        <div className="page-container"><div className="card">Document not found.</div></div>
        <Footer />
      </>
    );
  }

  return (
    <div>
      <Header />
      <div className="page-container">
      <div className="two-col">
        <main>
          <div className="card">
            <h1 className="page-title">{document.originalName}</h1>
            <div className="page-sub">Uploaded: {new Date(document.createdAt || Date.now()).toLocaleString()}</div>
            <div style={{height:12}} />
            <div className="summary-card section-card mt-4">
              <h3 style={{marginBottom:8}}>📌 Summary</h3>
              <p>{document.summary || "No summary available"}</p>
            </div>
          </div>

          {document.flashcards?.length > 0 && (
            <div className="card" style={{marginTop:12}}>
              <h3>🧠 Flashcards</h3>
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:10, marginTop:10}}>
                {document.flashcards.map((f, i) => (
                  <FlashcardList key={i} front={f.question || f.front} back={f.answer || f.back} />
                ))}
              </div>
            </div>
          )}

          {document.qa && (
            <section style={{marginTop:12}}>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {['summary','flashcards','mcq','fillups','truefalse','shortqa','longqa'].map(s => (
                  <button
                    key={s}
                    onClick={() => setSection(s)}
                    className={s === section ? 'btn-primary' : 'btn-ghost'}
                    style={{textTransform:'capitalize'}}
                  >{s}</button>
                ))}
              </div>

              <div style={{marginTop:12}}>
                {section === 'summary' && (
                  <div className="card section-card">{document.summary || 'No summary available'}</div>
                )}
                {section === 'flashcards' && (
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:10}}>
                    {document.flashcards?.map((f,i) => <FlashcardList key={i} front={f.question||f.front} back={f.answer||f.back} />)}
                  </div>
                )}
                {section === 'mcq' && <MCQ data={document.qa.mcq} />}
                {section === 'fillups' && <FillUps data={document.qa.fillUps} />}
                {section === 'truefalse' && <TrueFalse data={document.qa.trueFalse} />}
                {section === 'shortqa' && <ShortQA data={document.qa.shortQA} />}
                {section === 'longqa' && <LongQA data={document.qa.longQA} />}
              </div>
            </section>
          )}
        </main>

        <aside>
          <div className="card">
            <h3>Actions</h3>
            <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:8}}>
              <Button onClick={() => navigate(`/chat/${id}`)} className="btn-primary">Chat with Notes</Button>
              <Button onClick={() => navigate(`/study/${id}`)} className="btn-ghost">Study Mode</Button>
              <Button onClick={() => window.open(document.url || '#', '_blank')} className="btn-ghost">Open Original</Button>
            </div>
          </div>

          <div className="card" style={{marginTop:12}}>
            <h4>Document Info</h4>
            <div className="doc-meta" style={{marginTop:6}}>
              <div>Pages: {document.pages ?? '-'}</div>
              <div>Size: {document.size ? Math.round(document.size/1024) + ' KB' : '-'}</div>
              <div>Source: {document.source || 'upload'}</div>
            </div>
          </div>
        </aside>
      </div>
      </div>
      <Footer />
    </div>
  );
}
