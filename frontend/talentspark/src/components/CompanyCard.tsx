import type { Company } from "../types/company";
import { useState } from "react";

type Props = {
    companies: Company[];
    onedit: (company: Company) => void;
    ondelete: (id: number) => void;
    onadd: (company: Company) => void;
};

function CompanyCard({
    companies,
    onadd,
    onedit,
    ondelete,
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

        <div>

            {companies.map((company) => (

                <div key={company.id}>

                    {editCompanyId === company.id ? (

                        <>

                            <input
                                type="text"
                                placeholder="Company Name"
                                value={editform.name}
                                onChange={(e) =>
                                    setEditform({
                                        ...editform,
                                        name: e.target.value,
                                    })
                                }
                            />

                            <input
                                type="email"
                                placeholder="Email"
                                value={editform.email}
                                onChange={(e) =>
                                    setEditform({
                                        ...editform,
                                        email: e.target.value,
                                    })
                                }
                            />

                            <input
                                type="text"
                                placeholder="Phone Number"
                                value={editform.phone}
                                onChange={(e) =>
                                    setEditform({
                                        ...editform,
                                        phone: e.target.value,
                                    })
                                }
                            />

                            <input
                                type="text"
                                placeholder="Location"
                                value={editform.location}
                                onChange={(e) =>
                                    setEditform({
                                        ...editform,
                                        location: e.target.value,
                                    })
                                }
                            />

                            <button onClick={() => handleSave(company.id)}>
                                Save
                            </button>

                            <button onClick={handleCancel}>
                                Cancel
                            </button>

                        </>

                    ) : (

                        <>

                            <h1>{company.name}</h1>

                            <p>Email: {company.email}</p>

                            <p>Phone: {company.phone}</p>

                            <p>Location: {company.location}</p>

                            <button
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
                                onClick={() => ondelete(company.id)}
                            >
                                Delete
                            </button>

                        </>

                    )}

                    <hr />

                </div>

            ))}

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

            <button onClick={handleAdd}>
                Add
            </button>

        </div>

    );
}

export default CompanyCard;