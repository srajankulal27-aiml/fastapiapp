import "../styles/CompanyCard.css";
import { useState } from "react";
import type { Company } from "../types/company";

type Props = {
  companies: Company[];
  onedit: (company: Company) => void;
  ondelete: (id: number) => void;
  onadd: (company: Company) => void;
};

function CompanyCard({
  companies,
  onedit,
  ondelete,
  onadd,
}: Props) {
  const [editCompanyId, setEditCompanyId] = useState<number | null>(null);

  const [addform, setAddform] = useState<Company>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    location: "",
    jobs: [],
  });

  const [editform, setEditform] = useState<Company>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    location: "",
    jobs: [],
  });

  const handleAdd = () => {
    const { id, ...companyData } = addform;

    onadd(companyData as Company);

    setAddform({
      id: 0,
      name: "",
      email: "",
      phone: "",
      location: "",
      jobs: [],
    });
  };

  const handleSave = (id: number) => {
    const { id: _, ...companyData } = editform;

    onedit({ id, ...companyData } as Company);

    setEditCompanyId(null);

    setEditform({
      id: 0,
      name: "",
      email: "",
      phone: "",
      location: "",
      jobs: [],
    });
  };

  const handleCancel = () => {
    setEditCompanyId(null);

    setEditform({
      id: 0,
      name: "",
      email: "",
      phone: "",
      location: "",
      jobs: [],
    });
  };

  return (
    <div className="company-container">
      {companies.map((company) => (
        <div className="company-card" key={company.id}>
          {editCompanyId === company.id ? (
            <div className="add-company">
              <h2>Edit Company</h2>
              <input
                type="text"
                placeholder="Company Name"
                value={editform.name}
                onChange={(e) =>
                  setEditform({ ...editform, name: e.target.value })
                }
              />

              <input
                type="email"
                placeholder="Email"
                value={editform.email}
                onChange={(e) =>
                  setEditform({ ...editform, email: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Phone"
                value={editform.phone}
                onChange={(e) =>
                  setEditform({ ...editform, phone: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Location"
                value={editform.location}
                onChange={(e) =>
                  setEditform({ ...editform, location: e.target.value })
                }
              />

              <div className="card-buttons">
                <button
                  className="save-btn"
                  onClick={() => handleSave(company.id)}
                >
                  Save
                </button>

                <button className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="company-header">
                <div className="company-info">
                  <div className="company-logo">
                    {company.name ? company.name[0].toUpperCase() : "C"}
                  </div>
                  <h1 className="company-name">{company.name}</h1>
                </div>
                <span className="status">Active</span>
              </div>

              <div className="company-details">
                <p>
                  <strong>Email:</strong> {company.email}
                </p>

                <p>
                  <strong>Phone:</strong> {company.phone}
                </p>

                <p>
                  <strong>Location:</strong> {company.location}
                </p>
              </div>

              <div className="card-buttons">
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditCompanyId(company.id);

                    setEditform({
                      id: company.id,
                      name: company.name,
                      email: company.email,
                      phone: company.phone,
                      location: company.location,
                      jobs: [],
                    });
                  }}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => ondelete(company.id)}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      <div className="company-card add-company">
        <h2>Add Company</h2>

        <input
          type="text"
          placeholder="Company Name"
          value={addform.name}
          onChange={(e) =>
            setAddform({
              ...addform,
              name: e.target.value,
            })
          }
        />

        <input
          type="email"
          placeholder="Email"
          value={addform.email}
          onChange={(e) =>
            setAddform({
              ...addform,
              email: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={addform.phone}
          onChange={(e) =>
            setAddform({
              ...addform,
              phone: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Location"
          value={addform.location}
          onChange={(e) =>
            setAddform({
              ...addform,
              location: e.target.value,
            })
          }
        />

        <button className="add-btn" onClick={handleAdd}>
          Add Company
        </button>
      </div>
    </div>
  );
}

export default CompanyCard;