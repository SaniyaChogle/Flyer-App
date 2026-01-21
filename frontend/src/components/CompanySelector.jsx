import './CompanySelector.css';

const CompanySelector = ({ companies, selectedCompanyId, onCompanyChange, label = "Select Company" }) => {
  return (
    <div className="company-selector">
      <label htmlFor="company-select">{label}:</label>
      <select
        id="company-select"
        value={selectedCompanyId || ''}
        onChange={(e) => onCompanyChange(e.target.value ? parseInt(e.target.value) : null)}
        className="company-select-input"
      >
        <option value="">All Companies</option>
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CompanySelector;
