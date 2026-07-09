import { useState } from "react";
import { analyseResume } from "../../Services/RagService";
import { FaFileInvoice, FaMagic, FaCheckCircle } from "react-icons/fa";
import MarkdownRenderer from "../MarkdownRenderer";

export default function ResumePage() {
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      alert("Please paste some resume text to analyze.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await analyseResume(resumeText);
      setAnalysis(res.analysis);
    } catch (err) {
      setError("Failed to analyze resume. Please check your backend connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-page">
      <div className="page-header">
        <h1>AI Resume Analyzer</h1>
        <p>Paste candidate resume contents to evaluate matching skills, career fit, and optimization recommendations.</p>
      </div>

      <div className="resume-layout-grid">
        <div className="input-section card">
          <h3><FaFileInvoice /> Paste Resume Content</h3>
          <textarea
            rows={12}
            placeholder="Paste raw text copied from candidate's resume (PDF or DOCX)..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
          <button className="add-btn flex-btn" onClick={handleAnalyze} disabled={loading}>
            {loading ? "Analyzing Resume..." : <><FaMagic /> Analyze Profile</>}
          </button>
        </div>

        <div className="output-section card">
          <h3><FaCheckCircle /> Evaluation Report</h3>
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Analyzing skills, computing metrics, and scoring alignment against job roles...</p>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          {!loading && !analysis && !error && (
            <div className="empty-state">
              <FaFileInvoice className="empty-icon" />
              <p>Paste the resume content on the left and click "Analyze Profile" to view the detailed evaluation report.</p>
            </div>
          )}

          {!loading && analysis && (
            <div className="analysis-report-container">
              <div className="analysis-output">
                <MarkdownRenderer content={analysis} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
