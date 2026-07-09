import "../styles/Dashboard.css";

type Props = {
  children: React.ReactNode;
  sidebarOpen: boolean;
};

export default function Dashboard({ children, sidebarOpen }: Props) {
  return (
    <main className={`dashboard-main ${sidebarOpen ? "sidebar-open" : ""}`}>
      <div className="dashboard-container">
        {children}
      </div>
    </main>
  );
}