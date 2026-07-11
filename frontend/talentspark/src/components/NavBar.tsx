import {
  FaBell,
  FaSearch,
  FaUserCircle,
  FaBars,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import "../styles/Navbar.css";

type Props = {
  onLogout?: () => void;
  onToggleSidebar: () => void;
};

function NavBar({ onLogout, onToggleSidebar }: Props) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="hamburger-btn" onClick={onToggleSidebar} aria-label="Toggle Sidebar">
          <FaBars />
        </button>

        <h2 className="logo">
          Recruit<span>IQ</span>
        </h2>

        <nav className="nav-links">
          <Link to="/dashboard">Home</Link>
          <Link to="/companies">Companies</Link>
          <Link to="/jobs">Jobs</Link>
        </nav>
      </div>

      <div className="navbar-right">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search..."
          />
        </div>

        <FaBell className="nav-icon" />

        <div className="profile">
          <FaUserCircle />
          <span>Srajan</span>
        </div>

        {onLogout && (
          <button
            className="logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default NavBar;