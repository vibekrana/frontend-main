import React, { useState, useEffect } from 'react';
import './UserProfile.css';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    business_type: ''
  });

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
    
    // Apply saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = savedTheme;
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || 
                    localStorage.getItem('authToken') || 
                    localStorage.getItem('auth_token');
      
      console.log('Token found:', token ? 'Yes' : 'No');
      
      if (!token) {
        setError('Not authenticated - Please log in again');
        setLoading(false);
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      const response = await fetch('http://13.233.45.167:5000/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      console.log('Profile data:', data);
      setUserData(data);
      setEditForm({
        name: data.name || '',
        email: data.email || '',
        business_type: data.business_type || 'Not specified'
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getColorThemeValue = (themeName) => {
    const colorThemes = {
      'Blue': '#3B82F6',
      'Red': '#EF4444',
      'Green': '#10B981',
      'Purple': '#8B5CF6',
      'Orange': '#F97316',
      'Pink': '#EC4899',
      'Yellow': '#EAB308',
      'Teal': '#14B8A6',
      'Indigo': '#6366F1',
      'Default': '#6B7280',
      'Not set': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    };
    return colorThemes[themeName] || colorThemes['Default'];
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token') || 
                    localStorage.getItem('authToken') || 
                    localStorage.getItem('auth_token');
      
      if (!token) {
        alert('Authentication token not found. Please log in again.');
        window.location.href = '/login';
        return;
      }
      
      const response = await fetch('http://13.233.45.167:5000/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update error:', errorText);
        throw new Error('Failed to update profile');
      }

      const result = await response.json();
      setUserData(result.user);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Error updating profile: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="profile-container">
        <div className="error">No user data found</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <span>{userData.username?.charAt(0).toUpperCase()}</span>
        </div>
        <div className="profile-info">
          <h2>{userData.username}</h2>
          <p className="email">{userData.email}</p>
        </div>
        <button 
          className="edit-profile-btn"
          onClick={handleEditToggle}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <h3>Business Type</h3>
          {isEditing ? (
            <select
              name="business_type"
              value={editForm.business_type}
              onChange={handleInputChange}
            >
              <option value="Not specified">Not specified</option>
              <option value="Marketing Agency">Marketing Agency</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Technology">Technology</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            <p>{userData.business_type}</p>
          )}
        </div>

        <div className="stat-card">
          <h3>Member Since</h3>
          <p>{userData.created_at ? formatDate(userData.created_at) : 'Recently'}</p>
        </div>

        <div className="stat-card">
          <h3>Posts Created</h3>
          <p>{userData.posts_created || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Accounts Connected</h3>
          <p>0/4</p>
        </div>

        <div className="stat-card">
          <h3>Scheduled Time</h3>
          <div className="scheduled-time-display">
            <span className="time-icon">🕐</span>
            <p>{userData.scheduled_time || 'Not set'}</p>
          </div>
        </div>

        <div className="stat-card">
          <h3>Color Theme</h3>
          <div className="color-theme-display">
            <div 
              className="color-preview" 
              style={{ 
                background: getColorThemeValue(userData.color_theme),
                border: '2px solid var(--gray-300)'
              }}
            ></div>
            <p>{userData.color_theme || 'Not set'}</p>
          </div>
        </div>
      </div>

      <div className="profile-details">
        <h3>Profile Details</h3>
        
        <div className="detail-row">
          <label>Full Name</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={editForm.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
            />
          ) : (
            <p>{userData.name || 'Not provided'}</p>
          )}
        </div>

        <div className="detail-row">
          <label>Email Address</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={editForm.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
          ) : (
            <p>{userData.email}</p>
          )}
        </div>

        <div className="detail-row">
          <label>Username</label>
          <p>{userData.username}</p>
        </div>

        <div className="detail-row">
          <label>Last Updated</label>
          <p>{userData.updated_at ? formatDate(userData.updated_at) : 'Never'}</p>
        </div>

        {isEditing && (
          <button className="save-btn" onClick={handleSaveProfile}>
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;