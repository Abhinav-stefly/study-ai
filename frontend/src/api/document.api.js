import api from "./axios";

export const uploadDocument = async (formData) => {
  const res = await api.post("/documents/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getDocuments = async () => {
  const res = await api.get("/documents");
  // backend returns { documents: [...] }
  return res.data.documents || [];
};

export const getDocumentById = async (id) => {
  const res = await api.get(`/documents/${id}`);
  // API may return { document } or the document directly
  return res.data.document || res.data;
};
