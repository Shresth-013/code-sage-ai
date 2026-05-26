import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ResumeUpload from "./components/ResumeUpload";
import CodeReview from "./components/CodeReview";

function Navbar() {
  return (
    <nav style={{ background: "var(--bg)" }} className="border-b border-gray-200 px-6 py-4 flex items-center gap-6">
      <span className="font-bold text-blue-600 text-lg">Code Sage AI</span>
      <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors text-sm">
        Resume Analyzer
      </Link>
      <Link to="/code" className="text-gray-600 hover:text-blue-600 font-medium transition-colors text-sm">
        Code Reviewer
      </Link>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100svh", background: "var(--bg)" }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<ResumeUpload />} />
          <Route path="/code" element={<CodeReview />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;