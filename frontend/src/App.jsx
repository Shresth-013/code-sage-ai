// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import ResumeUpload from "./components/ResumeUpload";
import CodeReview from "./components/CodeReview";
import HintGenerator from "./components/HintGenerator";
import RoadmapGenerator from "./components/RoadmapGenerator";
import Login from "./components/Login";
import Signup from "./components/Signup";
import History from "./components/History";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-bg">
            <Sidebar />
            {/* md:pl-60 clears the fixed desktop rail; pb-16 clears the fixed
                mobile bottom bar (md:pb-0 removes it once the rail takes over). */}
            <main className="md:pl-60 pb-16 md:pb-0 relative z-10">
              <Routes>
                <Route path="/" element={<ResumeUpload />} />
                <Route path="/code" element={<CodeReview />} />
                <Route path="/hints" element={<HintGenerator />} />
                <Route path="/roadmap" element={<RoadmapGenerator />} />
                <Route path="/roadmap/:id" element={<RoadmapGenerator />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;