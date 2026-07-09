import { useState, useEffect } from "react";
import { getJobs, createJob, updateJob, deleteJob } from "../../Services/JobService";
import { getCompanies } from "../../Services/CompanyService";
import type { Job } from "../../types/job";
import type { Company } from "../../types/company";
import { FaPlus, FaTrash, FaEdit, FaTimes, FaMapMarkerAlt, FaDollarSign, FaBuilding, FaBriefcase } from "react-icons/fa";

export default function JobPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [editingJobId, setEditingJobId] = useState<number | null>(null);

  const [addForm, setAddForm] = useState({
    title: "",
    description: "",
    salary: 0,
    company_id: 0,
  });

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    salary: 0,
    company_id: 0,
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [jobsData, companiesData] = await Promise.all([
          getJobs(),
          getCompanies(),
        ]);
        setJobs(jobsData);
        setCompanies(companiesData);

        // Pre-select first company in add form if available
        if (companiesData.length > 0) {
          setAddForm((prev) => ({ ...prev, company_id: companiesData[0].id }));
        }
      } catch (err) {
        setError("Failed to fetch jobs or companies database records.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.title || !addForm.company_id) {
      alert("Please enter a job title and select a company.");
      return;
    }
    try {
      const newJob = await createJob({
        id: 0, // Backend will auto-generate the ID
        title: addForm.title,
        description: addForm.description,
        salary: Number(addForm.salary),
        company_id: Number(addForm.company_id),
      });
      setJobs((prev) => [...prev, newJob]);
      setAddForm({
        title: "",
        description: "",
        salary: 0,
        company_id: companies[0]?.id || 0,
      });
      setIsAdding(false);
    } catch (err) {
      alert("Failed to create job posting.");
      console.error(err);
    }
  };

  const handleEditClick = (job: Job) => {
    setEditingJobId(job.id);
    setEditForm({
      title: job.title,
      description: job.description,
      salary: job.salary,
      company_id: job.company_id,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    try {
      const updated = await updateJob(id, {
        id,
        title: editForm.title,
        description: editForm.description,
        salary: Number(editForm.salary),
        company_id: Number(editForm.company_id),
      });
      setJobs((prev) => prev.map((j) => (j.id === id ? updated : j)));
      setEditingJobId(null);
    } catch (err) {
      alert("Failed to save changes.");
      console.error(err);
    }
  };

  const handleDeleteClick = async (id: number) => {
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      console.error("Failed to delete job posting", err);
    }
  };

  const getCompanyName = (companyId: number) => {
    const c = companies.find((comp) => comp.id === companyId);
    return c ? c.name : "Unknown Company";
  };

  const getCompanyLocation = (companyId: number) => {
    const c = companies.find((comp) => comp.id === companyId);
    return c ? c.location : "Remote / Unknown";
  };

  if (loading) return <div className="loading-spinner">Loading job listings...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="job-page">
      <div className="page-header flex-header">
        <div>
          <h1>Job Openings</h1>
          <p>Create, update, and manage job opportunities across registered companies.</p>
        </div>
        {!isAdding && (
          <button className="add-btn flex-btn" onClick={() => setIsAdding(true)}>
            <FaPlus /> Post a Job
          </button>
        )}
      </div>

      {isAdding && (
        <div className="form-card card">
          <div className="card-header">
            <h3>Post a New Job Opening</h3>
            <button className="close-btn" onClick={() => setIsAdding(false)}>
              <FaTimes />
            </button>
          </div>
          <form onSubmit={handleAddSubmit}>
            <div className="form-group">
              <label>Job Title</label>
              <input
                type="text"
                placeholder="e.g. Senior Frontend Engineer"
                value={addForm.title}
                onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Company</label>
                <select
                  value={addForm.company_id}
                  onChange={(e) => setAddForm({ ...addForm, company_id: Number(e.target.value) })}
                  required
                >
                  <option value="">Select a Company</option>
                  {companies.map((comp) => (
                    <option key={comp.id} value={comp.id}>
                      {comp.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Salary (LPA / Annual USD)</label>
                <input
                  type="number"
                  placeholder="e.g. 150000"
                  value={addForm.salary || ""}
                  onChange={(e) => setAddForm({ ...addForm, salary: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                rows={4}
                placeholder="Describe role responsibilities, requirements, and benefits..."
                value={addForm.description}
                onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
              />
            </div>

            <div className="button-group">
              <button type="submit" className="save-btn">
                Publish Posting
              </button>
              <button type="button" className="cancel-btn" onClick={() => setIsAdding(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="jobs-list-grid">
        {jobs.length === 0 ? (
          <div className="empty-state card">
            <FaBriefcase className="empty-icon" />
            <p>No job postings found. Click "Post a Job" to get started.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="job-item-card card">
              {editingJobId === job.id ? (
                <form onSubmit={(e) => handleEditSubmit(e, job.id)}>
                  <div className="form-group">
                    <label>Job Title</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Company</label>
                      <select
                        value={editForm.company_id}
                        onChange={(e) => setEditForm({ ...editForm, company_id: Number(e.target.value) })}
                        required
                      >
                        {companies.map((comp) => (
                          <option key={comp.id} value={comp.id}>
                            {comp.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Salary</label>
                      <input
                        type="number"
                        value={editForm.salary}
                        onChange={(e) => setEditForm({ ...editForm, salary: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      rows={3}
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    />
                  </div>

                  <div className="button-group">
                    <button type="submit" className="save-btn">
                      Save Changes
                    </button>
                    <button type="button" className="cancel-btn" onClick={() => setEditingJobId(null)}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="job-card-header">
                    <h3>{job.title}</h3>
                    <div className="job-badge">{getCompanyName(job.company_id)}</div>
                  </div>
                  <p className="job-description">{job.description || "No description provided."}</p>
                  
                  <div className="job-meta">
                    <div className="meta-item">
                      <FaBuilding />
                      <span>{getCompanyName(job.company_id)}</span>
                    </div>
                    <div className="meta-item">
                      <FaMapMarkerAlt />
                      <span>{getCompanyLocation(job.company_id)}</span>
                    </div>
                    <div className="meta-item">
                      <FaDollarSign />
                      <span>{job.salary ? `${job.salary.toLocaleString()} LPA` : "Not Specified"}</span>
                    </div>
                  </div>

                  <div className="job-card-actions">
                    <button className="edit-btn text-btn" onClick={() => handleEditClick(job)}>
                      <FaEdit /> Edit
                    </button>
                    <button className="delete-btn text-btn" onClick={() => handleDeleteClick(job.id)}>
                      <FaTrash /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
