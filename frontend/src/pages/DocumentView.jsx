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

export default function DocumentView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

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
    return <p className="text-center mt-10">Document not found.</p>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">
        {document.originalName}
      </h1>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 mb-6">
        <Button onClick={() => navigate(`/chat/${id}`)}>
          Chat with Notes
        </Button>
        <Button onClick={() => navigate(`/study/${id}`)}>
          Study Mode
        </Button>
      </div>

      {/* SUMMARY */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">📌 Summary</h2>
        <p className="bg-gray-100 p-4 rounded">
          {document.summary || "No summary available"}
        </p>
      </section>

      {/* FLASHCARDS */}
      {document.flashcards?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">🧠 Flashcards</h2>
          <FlashcardList flashcards={document.flashcards} />
        </section>
      )}

      {/* QUESTIONS & ANSWERS */}
      {document.qa && (
        <section className="space-y-8">
          <MCQ data={document.qa.mcq} />
          <FillUps data={document.qa.fillUps} />
          <TrueFalse data={document.qa.trueFalse} />
          <ShortQA data={document.qa.shortQA} />
          <LongQA data={document.qa.longQA} />
        </section>
      )}
    </div>
  );
}
