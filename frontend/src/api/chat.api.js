import api from "./axios"; // 🔥 THIS WAS MISSING

export const chatWithDoc = async (docId, question) => {
  return api.post(`/chat/${docId}`, {
    question
  });
};
