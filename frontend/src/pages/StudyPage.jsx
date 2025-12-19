import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDocumentById } from "../api/document.api";
import Loader from "../components/common/Loader";
import FlashcardList from "../components/flashcards/Flashcard";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import MCQ from "../components/qa/MCQ";
import ShortQA from "../components/qa/ShortQA";
import LongQA from "../components/qa/LongQA";
import TrueFalse from "../components/qa/TrueFalse";
import FillUps from "../components/qa/FillUps";

export default function StudyPage() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  const [section, setSection] = useState('summary');

  useEffect(() => {
    async function load() {
      try {
        const d = await getDocumentById(id);
        setDoc(d);
      } catch (e) {
        console.error(e);
      } finally { setLoading(false); }
    }
    if (id) load();
  }, [id]);

  if (loading) return <Loader />;
  if (!doc) return <div><Header /><div className="page-container"><div className="card">Document not found.</div></div><Footer/></div>;

  const flashcards = doc.flashcards || [];

  return (
    <>
      <Header />
      <div className="page-container">
        <div className="page-header">
          <div>
            <div className="page-title">Study Mode — {doc.originalName}</div>
            <div className="page-sub">Practice with flashcards & questions. Click a card to flip.</div>
          </div>
        </div>

        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {['summary','flashcards','mcq','fillups','truefalse','shortqa','longqa'].map(s => (
            <button key={s} onClick={() => setSection(s)} className={s===section?'btn-primary':'btn-ghost'} style={{textTransform:'capitalize'}}>{s}</button>
          ))}
        </div>

        <div style={{marginTop:12}}>
          {section === 'summary' && <div className="card section-card">{doc.summary || 'No summary available'}</div>}

          {section === 'flashcards' && (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
              {flashcards.length === 0 && <div className="card">No flashcards found for this document.</div>}
              {flashcards.map((f, i) => (
                <FlashcardList key={i} front={f.question || f.front} back={f.answer || f.back} />
              ))}
            </div>
          )}

          {section === 'mcq' && <MCQ data={doc.qa?.mcq} />}
          {section === 'fillups' && <FillUps data={doc.qa?.fillUps} />}
          {section === 'truefalse' && <TrueFalse data={doc.qa?.trueFalse} />}
          {section === 'shortqa' && <ShortQA data={doc.qa?.shortQA} />}
          {section === 'longqa' && <LongQA data={doc.qa?.longQA} />}
        </div>
      </div>
      <Footer />
    </>
  );
}
