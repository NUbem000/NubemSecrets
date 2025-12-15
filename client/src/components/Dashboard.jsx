import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function Dashboard({ user, onLogout }) {
  const [secrets, setSecrets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSecret, setSelectedSecret] = useState(null);
  const [newSecret, setNewSecret] = useState({ name: '', value: '' });

  useEffect(() => {
    loadSecrets();
  }, []);

  const loadSecrets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/secrets`);
      setSecrets(response.data);
    } catch (error) {
      console.error('Error loading secrets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSecret = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/secrets`, newSecret);
      setNewSecret({ name: '', value: '' });
      setShowCreateModal(false);
      loadSecrets();
    } catch (error) {
      console.error('Error creating secret:', error);
      alert('Error creating secret: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleViewSecret = async (secretName) => {
    try {
      const response = await axios.get(`${API_URL}/api/secrets/${secretName}`);
      setSelectedSecret(response.data);
    } catch (error) {
      console.error('Error viewing secret:', error);
      alert('Error viewing secret: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDeleteSecret = async (secretName) => {
    if (!confirm(`Are you sure you want to delete "${secretName}"?`)) return;

    try {
      await axios.delete(`${API_URL}/api/secrets/${secretName}`);
      loadSecrets();
      if (selectedSecret?.name === secretName) {
        setSelectedSecret(null);
      }
    } catch (error) {
      console.error('Error deleting secret:', error);
      alert('Error deleting secret: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-brand">
          <svg viewBox="0 0 24 24" fill="currentColor" className="logo-icon">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
          </svg>
          <h1>NubemSecrets</h1>
        </div>
        <div className="navbar-user">
          <img src={user.photo} alt={user.name} className="user-avatar" />
          <span className="user-name">{user.name}</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="content-header">
          <div>
            <h2>Your Secrets</h2>
            <p className="subtitle">Manage your secure credentials and API keys</p>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary">
            + New Secret
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading secrets...</p>
          </div>
        ) : (
          <div className="secrets-grid">
            <div className="secrets-list">
              <div className="secrets-count">{secrets.length} secret(s)</div>
              {secrets.length === 0 ? (
                <div className="empty-state">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                  </svg>
                  <h3>No secrets yet</h3>
                  <p>Create your first secret to get started</p>
                  <button onClick={() => setShowCreateModal(true)} className="btn-primary">
                    Create Secret
                  </button>
                </div>
              ) : (
                secrets.map((secret) => (
                  <div key={secret.name} className="secret-card">
                    <div className="secret-info">
                      <h3>{secret.name}</h3>
                      <span className="secret-date">
                        Created: {new Date(secret.created?.seconds * 1000).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="secret-actions">
                      <button onClick={() => handleViewSecret(secret.name)} className="btn-view">
                        View
                      </button>
                      <button onClick={() => handleDeleteSecret(secret.name)} className="btn-delete">
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {selectedSecret && (
              <div className="secret-detail">
                <div className="detail-header">
                  <h3>{selectedSecret.name}</h3>
                  <button onClick={() => setSelectedSecret(null)} className="btn-close">×</button>
                </div>
                <div className="detail-content">
                  <label>Secret Value:</label>
                  <div className="secret-value">
                    <pre>{selectedSecret.value}</pre>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedSecret.value);
                      alert('Copied to clipboard!');
                    }}
                    className="btn-copy"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Secret</h2>
              <button onClick={() => setShowCreateModal(false)} className="btn-close">×</button>
            </div>
            <form onSubmit={handleCreateSecret} className="modal-body">
              <div className="form-group">
                <label>Secret Name</label>
                <input
                  type="text"
                  value={newSecret.name}
                  onChange={(e) => setNewSecret({ ...newSecret, name: e.target.value })}
                  placeholder="e.g., api-key-production"
                  required
                />
              </div>
              <div className="form-group">
                <label>Secret Value</label>
                <textarea
                  value={newSecret.value}
                  onChange={(e) => setNewSecret({ ...newSecret, value: e.target.value })}
                  placeholder="Enter your secret value..."
                  rows="4"
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Secret
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
