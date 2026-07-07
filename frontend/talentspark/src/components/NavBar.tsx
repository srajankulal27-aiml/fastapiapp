import {
  FaBell,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";

import "../styles/Navbar.css";

type Props = {
  onLogout?: () => void;
};

function NavBar({ onLogout }: Props) {
  return (
    <header className="navbar">

      <div className="navbar-left">

        <h2 className="logo">
          Talent<span>Spark</span>
        </h2>

        <nav className="nav-links">

          <a href="#">Home</a>

          <a href="#">About</a>

          <a href="#">Contact</a>

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