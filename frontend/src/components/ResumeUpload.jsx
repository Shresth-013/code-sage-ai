import { useState } from "react";

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload a file");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("http://localhost:3001/api/resume/analyze", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Error uploading file");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Resume</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload}>
        Analyze Resume
      </button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Extracted Text</h3>
          <p>{result.extractedText}</p>

          <h3>ATS Score: {result.analysis.atsScore}</h3>

          <h4>Strengths:</h4>
          <ul>
            {result.analysis.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          <h4>Missing Keywords:</h4>
          <ul>
            {result.analysis.missingKeywords.map((k, i) => (
              <li key={i}>{k}</li>
            ))}
          </ul>

          <h4>Suggestions:</h4>
          <ul>
            {result.analysis.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}