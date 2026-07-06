// import Welcome from "./components/Welcome";
import NavBar from "./components/NavBar";
import CompanyCard from "./components/CompanyCard";
import JobCard from "./components/JobCard";
import Footer from "./components/Footer";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import {useEffect,useState} from "react";
import { getCompanies,updateCompany,deleteCompany,createCompany } from "./Services/CompanyService";
import { isAuthenticated, logout } from "./Services/AuthService";
import type {Company} from "./types/company"
import Chat from "./components/pages/chat";

function App(){
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<Error | null>(null)
  const [companies,setCompanies] = useState<Company[]>([]);
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [currentPage, setCurrentPage] = useState<"login" | "register" | "dashboard">("login");

  async function fetchCompanies() {
    setLoading(true);
    try {
      const companies = await getCompanies();
      setCompanies(companies);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(company:Company){
    try{
      const updatedCompany = await updateCompany(company.id,company);
      setCompanies(companies.map((company) => company.id === updatedCompany.id ? updatedCompany : company));
    }catch(error){
      setError(error as Error);
    }
  }

  async function handleDelete(id:number){
    try{
      await deleteCompany(id);
      setCompanies(companies.filter((company) => company.id !== id));
    }catch(error){
      setError(error as Error);
    }
  }

  async function handleAdd(company:Company){
    try{
      const newCompany = await createCompany(company);
      setCompanies([...companies,newCompany]);
    }catch(error){
      setError(error as Error);
    }
  }

  function handleLogin(token: string) {
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
      return <Login 
        onLogin={handleLogin}
        onSwitchToRegister={() => setCurrentPage("register")}
      />;
    } else {
      return <Register 
        onRegister={() => setCurrentPage("login")}
        onSwitchToLogin={() => setCurrentPage("login")}
      />;
    }
  }

  if(loading){
    return <div>Loading...</div>
  }

  if(error){
    return <div>Error: {error.message}</div>
  }
  
  return(
    <>
    <NavBar onLogout={handleLogout} />
    {/* <Welcome /> */}
    <br />
    <CompanyCard 
    companies={companies}
    onedit={handleEdit}
    ondelete={handleDelete}
    onadd={handleAdd}
    />
    <JobCard />
    <Chat />
    <Footer />
    </>
  )
}

export default App