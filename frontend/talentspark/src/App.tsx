import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";

import Login from "./components/pages/Login";
import Register from "./components/pages/Register";

import DashboardPage from "./components/pages/DashboardPage";
import CompanyPage from "./components/pages/CompanyPage";
import JobPage from "./components/pages/JobPage";
import ResumePage from "./components/pages/ResumePage";
import ChatPage from "./components/pages/chat";
import RagPage from "./components/pages/RagPage";
import SearchPage from "./components/pages/SearchPage";

import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "./Services/CompanyService";

import { isAuthenticated, logout } from "./Services/AuthService";

import type { Company } from "./types/company";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [companies, setCompanies] = useState<Company[]>([]);

  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  const [currentPage, setCurrentPage] = useState<
    "login" | "register" | "dashboard"
  >("login");

  async function fetchCompanies() {
    setLoading(true);

    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(company: Company) {
    try {
      const newCompany = await createCompany(company);

      setCompanies((prev) => [...prev, newCompany]);
    } catch (err) {
      setError(err as Error);
    }
  }

  async function handleEdit(company: Company) {
    try {
      const updated = await updateCompany(company.id, company);

      setCompanies((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
    } catch (err) {
      setError(err as Error);
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteCompany(id);

      setCompanies((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err as Error);
    }
  }

  function handleLogin(_token: string) {
    setAuthenticated(true);
    setCurrentPage("dashboard");
    fetchCompanies();
  }

  function handleLogout() {
    logout();
    setAuthenticated(false);
    setCurrentPage("login");
    setCompanies([]);
  }

  useEffect(() => {
    if (isAuthenticated()) {
      setAuthenticated(true);
      setCurrentPage("dashboard");
      fetchCompanies();
    } else {
      setLoading(false);
    }
  }, []);

  if (!authenticated) {
    if (currentPage === "login") {
      return (
        <Login
          onLogin={handleLogin}
          onSwitchToRegister={() => setCurrentPage("register")}
        />
      );
    }

    return (
      <Register
        onRegister={() => setCurrentPage("login")}
        onSwitchToLogin={() => setCurrentPage("login")}
      />
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <NavBar onLogout={handleLogout} />

      <Sidebar />

      <Dashboard>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/companies"
            element={
              <CompanyPage
                companies={companies}
                onadd={handleAdd}
                onedit={handleEdit}
                ondelete={handleDelete}
              />
            }
          />

          <Route
            path="/jobs"
            element={<JobPage />}
          />

          <Route
            path="/resume"
            element={<ResumePage />}
          />

          <Route
            path="/chat"
            element={<ChatPage />}
          />

          <Route
            path="/search"
            element={<SearchPage />}
          />

          <Route
            path="/rag"
            element={<RagPage />}
          />

          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />
        </Routes>
      </Dashboard>

      <Footer />
    </>
  );
}

export default App;