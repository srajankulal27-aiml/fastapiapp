import "../styles/Dashboard.css";

type Props = {
  children: React.ReactNode;
};

export default function Dashboard({ children }: Props) {
  return (
    <div className="dashboard">

      <div className="dashboard-header">

        <div>
          <h1>Dashboard</h1>
          <p>Welcome to TalentSpark AI Hiring Platform</p>
        </div>

      </div>

      <div className="stats">

        <div className="stat-card">
          <h2>15</h2>
          <span>Companies</span>
        </div>

        <div className="stat-card">
          <h2>87</h2>
          <span>Jobs</span>
        </div>

        <div className="stat-card">
          <h2>12</h2>
          <span>Resume Analysis</span>
        </div>

        <div className="stat-card">
          <h2>34</h2>
          <span>AI Searches</span>
        </div>

      </div>

      <div className="dashboard-content">
        {children}
      </div>

    </div>
  );
}