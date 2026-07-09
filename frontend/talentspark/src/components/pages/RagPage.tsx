import { useState } from "react";
import { embedJobs, jobMatch, askAI } from "../../Services/RagService";
import { FaDatabase, FaQuestionCircle, FaMagic, FaCheckCircle, FaLaptopCode } from "react-icons/fa";
import MarkdownRenderer from "../MarkdownRenderer";

interface MatchResult {
  job_id?: number;
  title: string;
  description: string;
  salary?: number;
  match_score: number;
}

export default function RagPage() {
  const [activeTab, setActiveTab] = useState<"embed" | "match" | "ask">("match");

  // State for Embed
  const [embedLoading, setEmbedLoading] = useState(false);
  const [embedResult, setEmbedResult] = useState<string | null>(null);

  // State for Match
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [matchLoading, setMatchLoading] = useState(false);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [matchError, setMatchError] = useState<string | null>(null);

  // State for Ask
  const [question, setQuestion] = useState("");
  const [askLoading, setAskLoading] = useState(false);
  const [askAnswer, setAskAnswer] = useState<string | null>(null);
  const [askError, setAskError] = useState<string | null>(null);

  const handleEmbed = async () => {
    try {
      setEmbedLoading(true);
      setEmbedResult(null);
      const res = await embedJobs();
      setEmbedResult(res.message || `Successfully embedded jobs. (Count: ${res.count})`);
    } catch (err) {
      setEmbedResult("Failed to trigger job indexing. Verify vector store status.");
      console.error(err);
    } finally {
      setEmbedLoading(false);
    }
  };

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skills.trim()) {
      alert("Please specify candidate skills.");
      return;
    }
    try {
      setMatchLoading(true);
      setMatchError(null);
      setMatches([]);
      const res = await jobMatch(skills, experience);
      setMatches(res.matches || []);
    } catch (err) {
      setMatchError("Failed to match profile against job bank. Verify connection.");
      console.error(err);
    } finally {
      setMatchLoading(false);
    }
  };

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    try {
      setAskLoading(true);
      setAskError(null);
      setAskAnswer(null);
      const res = await askAI(question);
      setAskAnswer(res.answer);
    } catch (err) {
      setAskError("Failed to fetch RAG response. Verify model settings.");
      console.error(err);
    } finally {
      setAskLoading(false);
    }
  };

  return (
    <div className="rag-page">
      <div className="page-header">
        <h1>RAG & Profile Matching</h1>
        <p>Utilize Retrieval-Augmented Generation (RAG) to run profile-to-job matching algorithms and ask queries about jobs.</p>
      </div>

      <div className="rag-tabs">
        <button
          className={`tab-btn ${activeTab === "match" ? "active" : ""}`}
          onClick={() => setActiveTab("match")}
        >
          <FaLaptopCode /> Candidate Job Matcher
        </button>
        <button
          className={`tab-btn ${activeTab === "ask" ? "active" : ""}`}
          onClick={() => setActiveTab("ask")}
        >
          <FaQuestionCircle /> Conversational RAG
        </button>
        <button
          className={`tab-btn ${activeTab === "embed" ? "active" : ""}`}
          onClick={() => setActiveTab("embed")}
        >
          <FaDatabase /> Index Jobs Database
        </button>
      </div>

      <div className="rag-content-area tab-content card">
        {activeTab === "embed" && (
          <div className="embed-control-center">
            <h3>Index PostgreSQL Jobs into Qdrant Vector Store</h3>
            <p className="tab-desc">
              Synchronize all job postings from the PostgreSQL database into the Qdrant vector database.
              This processes descriptions and titles through OpenAI/Groq embedding models so they can be searched semantically.
            </p>
            <button className="add-btn flex-btn" onClick={handleEmbed} disabled={embedLoading}>
              {embedLoading ? "Indexing Jobs..." : <><FaDatabase /> Trigger Vector Indexing</>}
            </button>
            {embedResult && (
              <div className="info-box status-info-box">
                <FaCheckCircle />
                <span>{embedResult}</span>
              </div>
            )}
          </div>
        )}

        {activeTab === "match" && (
          <div className="profile-matcher-section">
            <h3>Match Candidate Profile Against Indexed Jobs</h3>
            <p className="tab-desc">Input skills and years of experience to run semantic matching calculations.</p>
            
            <form onSubmit={handleMatch} className="rag-form">
              <div className="form-group">
                <label>Candidate Skills</label>
                <input
                  type="text"
                  placeholder="e.g. React, TypeScript, Node.js, REST APIs"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Experience (Years / Description)</label>
                <input
                  type="text"
                  placeholder="e.g. 3 years of building frontend applications"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>

              <button type="submit" className="add-btn flex-btn" disabled={matchLoading}>
                {matchLoading ? "Finding Job Matches..." : <><FaMagic /> Find Best Matching Jobs</>}
              </button>
            </form>

            {matchError && <div className="error-message">{matchError}</div>}

            {matches.length > 0 && (
              <div className="matches-results-list">
                <h4>Top Semantic Matches</h4>
                <div className="results-grid">
                  {matches.map((item, index) => (
                    <div key={item.job_id || index} className="job-item-card card search-result-card">
                      <div className="job-card-header">
                        <h3>{item.title}</h3>
                        <div className="score-badge">
                          <span>{item.match_score ? item.match_score.toFixed(1) : "0.0"}% Score</span>
                        </div>
                      </div>
                      <p className="job-description">{item.description}</p>
                      {item.salary && (
                        <div className="job-meta">
                          <div className="meta-item">
                            <span>Salary: {item.salary.toLocaleString()} LPA</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "ask" && (
          <div className="conversational-rag-section">
            <h3>Retrieve and Answer Questions Using Job Records</h3>
            <p className="tab-desc">Ask specific questions about the job postings, like "What python jobs are available in Bangalore?" or "Do we have roles paying over 12 LPA?".</p>

            <form onSubmit={handleAsk} className="rag-form inline-form">
              <input
                type="text"
                placeholder="Ask about job details, salaries, locations, or requirements..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
              <button type="submit" className="save-btn" disabled={askLoading}>
                {askLoading ? "Generating Answer..." : "Ask DB"}
              </button>
            </form>

            {askError && <div className="error-message">{askError}</div>}

            {askAnswer && (
              <div className="answer-card card">
                <h4>AI Answer:</h4>
                <div className="answer-text">
                  <MarkdownRenderer content={askAnswer} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
