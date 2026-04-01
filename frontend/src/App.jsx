import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null); // ✅ NEW STATE

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload a resume first");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("http://localhost:3001/api/resume/analyze?resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("Response:", data);

      setResult(data); // ✅ SHOW IN UI (instead of alert)

    } catch (error) {
      console.error(error);
      alert("Error connecting to server");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Code Sage AI</h1>

      <div className="card">
        <h2>Upload Resume</h2>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="file-input"
        />

        <button className="btn" onClick={handleAnalyze}>
          Analyze Resume
        </button>

        <p className="note">
          AI-powered resume analysis coming soon...
        </p>

        {/* ✅ RESULT UI */}
        {result && (
          <div className="result">
            <h3>Analysis Result</h3>

            <p><strong>ATS Score:</strong> {result.analysis?.atsScore}</p>

            <h4>Strengths:</h4>
            <ul>
              {result.analysis?.strengths?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <h4>Missing Keywords:</h4>
            <ul>
              {result.analysis?.missingKeywords?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <h4>Suggestions:</h4>
            <ul>
              {result.analysis?.suggestions?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;