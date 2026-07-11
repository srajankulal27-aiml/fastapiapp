import { Link, useLocation } from "react-router-dom";
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
  FaTimes,
} from "react-icons/fa";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: Props) {
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    { path: "/dashboard", label: "Dashboard", icon: <FaHome /> },
    { path: "/companies", label: "Companies", icon: <FaBuilding /> },
    { path: "/jobs", label: "Jobs", icon: <FaBriefcase /> },
    { path: "/resume", label: "Resume Analyzer", icon: <FaFileAlt /> },
    { path: "/chat", label: "AI Chat", icon: <FaRobot /> },
    { path: "/search", label: "Semantic Search", icon: <FaSearch /> },
    { path: "/rag", label: "RAG Tools", icon: <FaDatabase /> },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="logo">
        <h2>Recruit<span>IQ</span></h2>
        <button className="close-sidebar-btn" onClick={onClose} aria-label="Close Sidebar">
          <FaTimes />
        </button>
      </div>

      <nav>
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={currentPath === link.path ? "active" : ""}
            onClick={onClose}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <Link to="/dashboard" onClick={onClose}>
          <FaUserCog />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}