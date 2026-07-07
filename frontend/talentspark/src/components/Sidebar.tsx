import "../styles/Sidebar.css";
import {
  FaHome,
  FaBuilding,
  FaBriefcase,
  FaFileAlt,
  FaRobot,
  FaSearch,
  FaDatabase,
  FaUserCog,
} from "react-icons/fa";

export default function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="logo">
        <h2>TalentSpark</h2>
      </div>

      <nav>

        <a href="#">
          <FaHome />
          Dashboard
        </a>

        <a href="#">
          <FaBuilding />
          Companies
        </a>

        <a href="#">
          <FaBriefcase />
          Jobs
        </a>

        <a href="#">
          <FaFileAlt />
          Resume Analyzer
        </a>

        <a href="#">
          <FaRobot />
          AI Chat
        </a>

        <a href="#">
          <FaSearch />
          Semantic Search
        </a>

        <a href="#">
          <FaDatabase />
          RAG Tools
        </a>

      </nav>

      <div className="sidebar-bottom">

        <a href="#">
          <FaUserCog />
          Settings
        </a>

      </div>

    </aside>
  );
}