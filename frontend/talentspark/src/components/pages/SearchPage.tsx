import { useState } from "react";
import { semanticSearch } from "../../Services/RagService";
import { FaSearch, FaSearchLocation, FaDollarSign, FaChartLine } from "react-icons/fa";

interface SearchResult {
  job_id: number;
  title: string;
  description: string;
  salary?: number;
  score: number;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const res = await semanticSearch(query);
      setResults(res.results || []);
    } catch (err) {
      setError("Failed to perform semantic search. Please check your backend.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <div className="page-header">
        <h1>AI Semantic Search</h1>
        <p>Query job opportunities using natural language queries like "react developers with high packages" or "python developers".</p>
      </div>

      <div className="search-bar-container card">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Type a query (e.g., 'Looking for senior backend developers skilled in Django and database migrations')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
          <button type="submit" className="save-btn search-btn">
            <FaSearch /> Search
          </button>
        </form>
      </div>

      <div className="search-results-section">
        {loading && <div className="loading-spinner">Searching semantic database...</div>}

        {error && <div className="error-message">{error}</div>}

        {!loading && results.length === 0 && !error && query && (
          <div className="empty-state card">
            <FaSearchLocation className="empty-icon" />
            <p>No results found for "{query}". Try a different or broader query.</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="results-grid">
            {results.map((item, idx) => (
              <div key={item.job_id || idx} className="job-item-card card search-result-card">
                <div className="job-card-header">
                  <h3>{item.title}</h3>
                  <div className="score-badge">
                    <FaChartLine />
                    <span>{(item.score * 100).toFixed(1)}% Match</span>
                  </div>
                </div>

                <p className="job-description">{item.description}</p>

                <div className="job-meta">
                  <div className="meta-item">
                    <FaDollarSign />
                    <span>{item.salary ? `${item.salary.toLocaleString()} LPA` : "Not Specified"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
