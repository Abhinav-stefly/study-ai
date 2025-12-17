import { useState } from "react";
import { uploadDocument } from "../../api/document.api";
import Button from "../common/Button";
import Loader from "../common/Loader";

export default function UploadDocument({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadDocument(formData);

      if (onUploadSuccess) {
        onUploadSuccess(res.document);
      }

      setFile(null);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3>Upload Study Material</h3>

      <input
        type="file"
        accept=".pdf,image/*"
        onChange={handleFileChange}
      />

      {error && <p style={styles.error}>{error}</p>}

      {loading ? (
        <Loader />
      ) : (
        <Button onClick={handleUpload}>Upload</Button>
      )}
    </div>
  );
}

const styles = {
  container: {
    border: "1px solid #ddd",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
};
