import CompanyCard from "../CompanyCard";
import type { Company } from "../../types/company";

type Props = {
  companies: Company[];
  onedit: (company: Company) => void;
  ondelete: (id: number) => void;
  onadd: (company: Company) => void;
};

export default function CompanyPage({ companies, onedit, ondelete, onadd }: Props) {
  return (
    <div className="company-page">
      <div className="page-header">
        <h1>Company Profiles</h1>
        <p>Manage and configure company profiles associated with hiring campaigns.</p>
      </div>
      <CompanyCard
        companies={companies}
        onedit={onedit}
        ondelete={ondelete}
        onadd={onadd}
      />
    </div>
  );
}
