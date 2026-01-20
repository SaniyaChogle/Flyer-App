import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { flyerAPI } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [allFlyers, setAllFlyers] = useState([]);
  const [title, setTitle] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('all');
  const [enlargedImage, setEnlargedImage] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchAllFlyers = useCallback(async (companiesList) => {
    try {
      const flyersPromises = companiesList.map(company =>
        flyerAPI.getFlyersByCompany(company.id)
      );
      const flyersResponses = await Promise.all(flyersPromises);

      const allFlyersData = flyersResponses.flatMap((response, index) =>
        response.data.map(flyer => ({
          ...flyer,
          companyName: companiesList[index].name
        }))
      );

      setAllFlyers(allFlyersData);
    } catch (err) {
      console.error('Failed to load flyers', err);
    }
  }, []);

  const fetchCompanies = useCallback(async () => {
    try {
      const response = await flyerAPI.getCompanies();
      setCompanies(response.data);
      if (response.data.length > 0) {
        setCompanyId(response.data[0].id);
        // Fetch flyers for all companies
        fetchAllFlyers(response.data);
      }
    } catch (err) {
      console.error('Failed to load companies:', err);
      setError('Failed to load companies');
    }
  }, [fetchAllFlyers]);

  useEffect(() => {
    if (user?.role !== 'Admin') {
      navigate('/login');
      return;
    }
    fetchCompanies();
  }, [user, navigate, fetchCompanies]);

  const handleDeleteFlyer = async (flyerId) => {
    if (!window.confirm('Are you sure you want to delete this flyer?')) {
      return;
    }

    try {
      await flyerAPI.deleteFlyer(flyerId);
      setMessage('Flyer deleted successfully!');
      setAllFlyers(allFlyers.filter(f => f.id !== flyerId));
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete flyer');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Only PNG and JPG files are allowed');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!title || !companyId || !file) {
      setError('Please fill all fields and select a file');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('companyId', companyId);
      formData.append('file', file);

      await flyerAPI.uploadFlyer(formData);

      setMessage('Flyer uploaded successfully!');
      setTitle('');
      setFile(null);
      // Reset file input
      document.getElementById('file-input').value = '';
      // Refresh flyers list
      fetchAllFlyers(companies);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload flyer');
    } finally {
      setUploading(false);
    }
  };

  const handleImageClick = (flyer) => {
    setEnlargedImage({
      url: flyerAPI.getFlyerImageUrl(flyer.imagePath),
      title: flyer.title,
      companyName: flyer.companyName
    });
  };

  const closeEnlargedImage = () => {
    setEnlargedImage(null);
  };

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && enlargedImage) {
        closeEnlargedImage();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [enlargedImage]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-container">
      {/* Image Modal */}
      {enlargedImage && (
        <div className="image-modal" onClick={closeEnlargedImage}>
          <button className="modal-close" onClick={closeEnlargedImage}>×</button>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={enlargedImage.url} alt={enlargedImage.title} />
            <p className="modal-title">{enlargedImage.title}</p>
            {enlargedImage.companyName && (
              <p className="modal-company">{enlargedImage.companyName}</p>
            )}
          </div>
        </div>
      )}

      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="admin-content">
        <div className="upload-card">
          <h2>Upload Flyer</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Flyer Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter flyer title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="company">Select Company</label>
              <select
                id="company"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                required
              >
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="file-input">Upload Image (PNG/JPG)</label>
              <input
                type="file"
                id="file-input"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                required
              />
              {file && <p className="file-name">Selected: {file.name}</p>}
            </div>

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <button type="submit" disabled={uploading} className="upload-btn">
              {uploading ? 'Uploading...' : 'Upload Flyer'}
            </button>
          </form>
        </div>

        <div className="flyers-list-card">
          <h2>All Uploaded Flyers</h2>

          <div className="filter-group">
            <label htmlFor="company-filter">Filter by Company:</label>
            <select
              id="company-filter"
              value={selectedCompanyFilter}
              onChange={(e) => setSelectedCompanyFilter(e.target.value)}
            >
              <option value="all">All Companies</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flyers-table">
            {allFlyers
              .filter(f => selectedCompanyFilter === 'all' || f.companyId === parseInt(selectedCompanyFilter))
              .map((flyer) => (
                <div key={flyer.id} className="flyer-row">
                  <img
                    src={flyerAPI.getFlyerImageUrl(flyer.imagePath)}
                    alt={flyer.title}
                    className="flyer-thumbnail"
                    onClick={() => handleImageClick(flyer)}
                    style={{ cursor: 'pointer' }}
                    title="Click to view full size"
                  />
                  <div className="flyer-details">
                    <h3>{flyer.title}</h3>
                    <p className="company-badge">{flyer.companyName}</p>
                    <p className="flyer-date">
                      {new Date(flyer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteFlyer(flyer.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              ))}
            {allFlyers.length === 0 && (
              <p className="no-flyers">No flyers uploaded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
