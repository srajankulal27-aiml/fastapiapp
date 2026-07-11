import "../styles/RagTools.css";
import { useState } from "react";
import {
  analyseResume,
  semanticSearch,
  askAI,
  jobMatch,
  embedJobs,
} from "../Services/RagService";

export default function RagTools() {
  const [resume, setResume] = useState("");
  const [query, setQuery] = useState("");
  const [question, setQuestion] = useState("");
  const [skills, setSkills] =useState("");
  const [experience, setExperience] = useState("");

  // Separate outputs
  const [resumeOutput, setResumeOutput] = useState("");
  const [searchOutput, setSearchOutput] = useState("");
  const [askOutput, setAskOutput] = useState("");
  const [matchOutput, setMatchOutput] = useState("");
  const [embedOutput, setEmbedOutput] = useState("");

  const handleResume = async () => {
    const res = await analyseResume(resume);
    setResumeOutput(res.analysis);
  };

  const handleSearch = async () => {
    const res = await semanticSearch(query);
    setSearchOutput(JSON.stringify(res.results, null, 2));
  };

  const handleAsk = async () => {
    const res = await askAI(question);
    setAskOutput(res.answer);
  };

  const handleMatch = async () => {
    const res = await jobMatch(skills, experience);
    setMatchOutput(JSON.stringify(res.matches, null, 2));
  };

  const handleEmbed = async () => {
    const res = await embedJobs();
    setEmbedOutput(res.message);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>RecruitIQ AI - RAG Tools</h1>

      <hr />

      {/* Resume Analyzer */}
      <h2>Resume Analyzer</h2>

      <textarea
        rows={10}
        style={{ width: "100%" }}
        value={resume}
        onChange={(e) => setResume(e.target.value)}
        placeholder="Paste your resume here..."
      />

      <br />

      <button onClick={handleResume}>Analyze Resume</button>

      <pre
        style={{
          background: "#111",
          color: "white",
          padding: 20,
          borderRadius: 10,
          marginTop: 10,
          whiteSpace: "pre-wrap",
        }}
      >
        {resumeOutput}
      </pre>

      <hr />

      {/* Semantic Search */}
      <h2>Semantic Job Search</h2>

      <input
        style={{ width: "100%" }}
        placeholder="Search jobs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={handleSearch}>Search</button>

      <pre
        style={{
          background: "#111",
          color: "white",
          padding: 20,
          borderRadius: 10,
          marginTop: 10,
          whiteSpace: "pre-wrap",
        }}
      >
        {searchOutput}
      </pre>

      <hr />

      {/* Ask AI */}
      <h2>Ask AI</h2>

      <input
        style={{ width: "100%" }}
        placeholder="Ask anything..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button onClick={handleAsk}>Ask</button>

      <pre
        style={{
          background: "#111",
          color: "white",
          padding: 20,
          borderRadius: 10,
          marginTop: 10,
          whiteSpace: "pre-wrap",
        }}
      >
        {askOutput}
      </pre>

      <hr />

      {/* Job Match */}
      <h2>Job Match</h2>

      <input
        style={{ width: "100%" }}
        placeholder="Skills"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />

      <br />

      <input
        style={{ width: "100%", marginTop: 10 }}
        placeholder="Experience"
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
      />

      <br />

      <button onClick={handleMatch}>Match Jobs</button>

      <pre
        style={{
          background: "#111",
          color: "white",
          padding: 20,
          borderRadius: 10,
          marginTop: 10,
          whiteSpace: "pre-wrap",
        }}
      >
        {matchOutput}
      </pre>

      <hr />

      {/* Embed Jobs */}
      <h2>Embed Jobs</h2>

      <button onClick={handleEmbed}>Embed Jobs</button>

      <pre
        style={{
          background: "#111",
          color: "white",
          padding: 20,
          borderRadius: 10,
          marginTop: 10,
          whiteSpace: "pre-wrap",
        }}
      >
        {embedOutput}
      </pre>
    </div>
  );
}