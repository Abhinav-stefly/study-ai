import { createContext, useContext, useState } from "react";

const DocumentContext = createContext();

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [currentDoc, setCurrentDoc] = useState(null);

  return (
    <DocumentContext.Provider
      value={{ documents, setDocuments, currentDoc, setCurrentDoc }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocumentsContext = () => useContext(DocumentContext);
