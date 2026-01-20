import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { flyerAPI } from '../services/api';
import './CompanyDashboard.css';

const CompanyDashboard = () => {
  const [flyers, setFlyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sharingId, setSharingId] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchFlyers = useCallback(async () => {
    if (!user?.companyId) return;

    try {
      const response = await flyerAPI.getFlyersByCompany(user.companyId);
      setFlyers(response.data);
    } catch (err) {
      console.error('Failed to load flyers:', err);
      setError('Failed to load flyers');
    } finally {
      setLoading(false);
    }
  }, [user?.companyId]);

  useEffect(() => {
    if (user?.role !== 'Company' || !user?.companyId) {
      navigate('/login');
      return;
    }
    fetchFlyers();
  }, [user, navigate, fetchFlyers]);

  const handleDownload = async (flyerId, title) => {
    const downloadUrl = flyerAPI.downloadFlyer(flyerId);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${title}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWhatsAppShare = async (flyer) => {
    setSharingId(flyer.id);
    setError('');

    try {
      const imageUrl = flyerAPI.getFlyerImageUrl(flyer.imagePath);
      console.log('Fetching image from:', imageUrl);
      const response = await fetch(imageUrl);
      console.log('Fetch response:', response.status, response.ok);
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);

      const blob = await response.blob();
      console.log('Blob created:', blob.size, blob.type);
      const extension = flyer.imagePath.split('.').pop().toLowerCase();
      const mimeType = extension === 'png' ? 'image/png' : 'image/jpeg';
      const fileName = `${flyer.title.replace(/[^a-z0-9\s]/gi, '_')}.${extension}`;
      const file = new File([blob], fileName, { type: mimeType });
      const shareMessage = `${flyer.title}\n\nShared from ${user?.companyName}`;

      // Detect mobile device
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        // MOBILE: Try Web Share API first
        console.log('Checking Web Share API support...');
        console.log('navigator.canShare:', navigator.canShare);
        console.log('Can share files?', navigator.canShare ? navigator.canShare({ files: [file] }) : false);

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            console.log('Attempting to share with Web Share API...');
            await navigator.share({
              files: [file],
              title: flyer.title,
              text: shareMessage,
            });
            console.log('Share successful!');
            return; // Success!
          } catch (shareErr) {
            console.error('Share error:', shareErr.name, shareErr.message);
            if (shareErr.name === 'AbortError') {
              setSharingId(null);
              return; // User cancelled
            }
            // If share fails, fall through to wa.me link
            alert(`Share failed: ${shareErr.message}\nFalling back to manual method...`);
          }
        } else {
          console.log('Web Share API not available, using fallback...');
        }

        // MOBILE FALLBACK: Download + open WhatsApp
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);

        await new Promise(resolve => setTimeout(resolve, 500));

        alert(
          `✓ Image downloaded: "${fileName}"\n\n` +
          `TO SHARE ON WHATSAPP:\n` +
          `1. Open WhatsApp manually\n` +
          `2. Select a contact or group\n` +
          `3. Tap the + or 📎 (attachment) icon\n` +
          `4. Choose "Gallery" or "Photos"\n` +
          `5. Find and select "${fileName}"\n` +
          `6. Add your message and Send!`
        );

      } else {
        // DESKTOP: Download + open WhatsApp Web
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);

        await new Promise(resolve => setTimeout(resolve, 500));

        const proceed = confirm(
          `✓ Image downloaded: "${fileName}"\n\n` +
          `TO SHARE ON WHATSAPP:\n` +
          `1. Click OK to open WhatsApp Web\n` +
          `2. Select a contact or group\n` +
          `3. Click the 📎 (paperclip/attachment) icon\n` +
          `4. Select "Photos & Videos"\n` +
          `5. Choose "${fileName}" from your Downloads\n` +
          `6. Send!\n\n` +
          `Ready to open WhatsApp Web?`
        );

        if (proceed) {
          // Open WhatsApp Web - just the base URL, no parameters
          window.open('https://web.whatsapp.com/', '_blank');
        }
      }

    } catch (err) {
      console.error('Share failed:', err);
      const errorMessage = err.message || 'Unknown error';
      setError(`Failed to share: ${errorMessage}. Please try the Download button instead.`);
      alert(`Error: ${errorMessage}\n\nPlease try using the Download button instead.`);
    } finally {
      setSharingId(null);
    }
  };

  const handleDeleteFlyer = async (flyerId) => {
    if (!window.confirm('Are you sure you want to delete this flyer?')) {
      return;
    }

    try {
      await flyerAPI.deleteFlyer(flyerId);
      setFlyers(flyers.filter(f => f.id !== flyerId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete flyer');
    }
  };

  const handleImageClick = (flyer) => {
    setEnlargedImage({
      url: flyerAPI.getFlyerImageUrl(flyer.imagePath),
      title: flyer.title
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
    <div className="company-container">
      {/* Image Modal */}
      {enlargedImage && (
        <div className="image-modal" onClick={closeEnlargedImage}>
          <button className="modal-close" onClick={closeEnlargedImage}>×</button>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={enlargedImage.url} alt={enlargedImage.title} />
            <p className="modal-title">{enlargedImage.title}</p>
          </div>
        </div>
      )}

      <div className="company-header">
        <div>
          <h1>{user?.companyName}</h1>
          <p>Your Flyers</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="company-content">
        {loading && <p className="loading">Loading flyers...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && flyers.length === 0 && (
          <div className="no-flyers">
            <p>No flyers available yet.</p>
          </div>
        )}

        <div className="flyers-grid">
          {flyers.map((flyer) => (
            <div key={flyer.id} className="flyer-card">
              <img
                src={flyerAPI.getFlyerImageUrl(flyer.imagePath)}
                alt={flyer.title}
                className="flyer-image"
                onClick={() => handleImageClick(flyer)}
                style={{ cursor: 'pointer' }}
                title="Click to view full size"
              />
              <div className="flyer-info">
                <h3>{flyer.title}</h3>
                <p className="flyer-date">
                  {new Date(flyer.createdAt).toLocaleDateString()}
                </p>
                <div className="flyer-actions">
                  <button
                    onClick={() => handleDownload(flyer.id, flyer.title)}
                    className="btn-download"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleWhatsAppShare(flyer)}
                    className="btn-whatsapp"
                    disabled={sharingId === flyer.id}
                    title="Download and share on WhatsApp"
                  >
                    {sharingId === flyer.id ? 'Preparing...' : '💬 Share to WhatsApp'}
                  </button>
                  <button
                    onClick={() => handleDeleteFlyer(flyer.id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
