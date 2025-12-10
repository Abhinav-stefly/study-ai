// ...existing code...
export const summarizeText = async (text) => {
  if (!text) return "";
  const lines = text.trim().split(/\r?\n+/).filter(Boolean);
  return lines.slice(0, 3).join(' ');
};
// ...existing code...