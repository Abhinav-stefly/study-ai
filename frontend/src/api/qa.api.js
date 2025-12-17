import api from "./axios";

export const getQA = (docId) =>
  api.get(`/qa/${docId}`);
