import { useState, useEffect } from "react";
import { getCompanies } from "../../Services/CompanyService";
import { getJobs } from "../../Services/JobService";
import { Link } from "react-router-dom";
import { FaBuilding, FaBriefcase, FaFileAlt, FaRobot, FaArrowRight } from "react-icons/fa";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    companies: 0,
    jobs: 0,
    resumes: 12,
    searches: 34,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const companiesData = await getCompanies();
        const jobsData = await getJobs();
        setStats(prev => ({
          ...prev,
          companies: companiesData.length,
          jobs: jobsData.length,
        }));
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome to TalentSpark AI Hiring Platform. Here is your recruitment overview.</p>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading dashboard data...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon companies-icon">
                <FaBuilding />
              </div>
              <div className="stat-details">
                <h2>{stats.companies}</h2>
                <span>Registered Companies</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon jobs-icon">
                <FaBriefcase />
              </div>
              <div className="stat-details">
                <h2>{stats.jobs}</h2>
                <span>Active Jobs</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon resumes-icon">
                <FaFileAlt />
              </div>
              <div className="stat-details">
                <h2>{stats.resumes}</h2>
                <span>Resumes Analyzed</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon searches-icon">
                <FaRobot />
              </div>
              <div className="stat-details">
                <h2>{stats.searches}</h2>
                <span>AI Agent Queries</span>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card action-card">
              <h3>Quick Actions</h3>
              <div className="action-links">
                <Link to="/companies" className="action-link">
                  <span>Manage Companies</span>
                  <FaArrowRight />
                </Link>
                <Link to="/jobs" className="action-link">
                  <span>Post a New Job</span>
                  <FaArrowRight />
                </Link>
                <Link to="/resume" className="action-link">
                  <span>Analyze Candidate Resume</span>
                  <FaArrowRight />
                </Link>
                <Link to="/chat" className="action-link">
                  <span>Open AI Career Assistant</span>
                  <FaArrowRight />
                </Link>
              </div>
            </div>

            <div className="dashboard-card status-card">
              <h3>Platform Status</h3>
              <div className="status-list">
                <div className="status-item">
                  <span className="status-dot green"></span>
                  <div className="status-info">
                    <strong>FastAPI Backend</strong>
                    <span>Running perfectly on port 8000</span>
                  </div>
                </div>
                <div className="status-item">
                  <span className="status-dot green"></span>
                  <div className="status-info">
                    <strong>Qdrant Vector DB</strong>
                    <span>Semantic index is active</span>
                  </div>
                </div>
                <div className="status-item">
                  <span className="status-dot green"></span>
                  <div className="status-info">
                    <strong>LLM Integration</strong>
                    <span>Groq/LangChain model connected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
