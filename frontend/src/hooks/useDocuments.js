import { useEffect } from "react";
import { getDocuments } from "../api/document.api";
import { useDocumentsContext } from "../context/DocumentContext";

export default function useDocuments() {
  const { documents, setDocuments } = useDocumentsContext();

  useEffect(() => {
    getDocuments()
      .then(docs => {
        // normalize to array in case API returns { documents: [...] }
        if (Array.isArray(docs)) return setDocuments(docs);
        if (docs && Array.isArray(docs.documents)) return setDocuments(docs.documents);
        console.warn("useDocuments: unexpected getDocuments result:", docs);
        return setDocuments([]);
      })
      .catch(err => {
        console.warn("useDocuments: failed to load documents", err);
        setDocuments([]);
      });
  }, []);

  return documents;
}
