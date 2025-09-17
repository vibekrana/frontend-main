// src/components/LinkedInConnect.js
import React, { useEffect } from 'react';

const LinkedInConnect = ({ appUser, onConnected, connected }) => {
  
  // Listen for popup messages
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'linkedin_callback') {
        if (event.data.success) {
          alert(`LinkedIn connected successfully! ${event.data.posting_method || 'Personal Profile'}`);
          onConnected(); // Refresh status
          
          // Redirect to content page after successful connection
          setTimeout(() => {
            console.log('Redirecting to content page...');
            window.location.href = '/content';
          }, 2000);
          
        } else {
          alert(`LinkedIn connection failed: ${event.data.error}`);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onConnected]);

  const handleConnect = () => {
    const clientId = '86geycovoa141y'; // Your LinkedIn Client ID
    const redirectUri = encodeURIComponent('http://13.233.45.167:5000/social/linkedin/callback');
    
    // Using your actual available scopes
    const scope = encodeURIComponent('r_basicprofile w_member_social w_organization_social r_organization_social rw_organization_admin');
    const state = encodeURIComponent(appUser); // Pass appUser for backend verification
    
    const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
    
    // Open in popup window
    const popup = window.open(url, 'linkedin-auth', 'width=600,height=600,scrollbars=yes,resizable=yes');
    
    // Check if popup was blocked
    if (!popup) {
      alert('Popup blocked. Please allow popups for this site and try again.');
      return;
    }
    
    // Monitor popup
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        // Give some time for message to be processed
        setTimeout(() => {
          onConnected(); // Refresh status when popup closes
        }, 1000);
      }
    }, 1000);
  };

  const handleDisconnect = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login again to disconnect LinkedIn.');
        window.location.href = '/login';
        return;
      }

      const response = await fetch('http://13.233.45.167:5000/social/linkedin/disconnect', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ app_user: appUser })
      });
      
      if (response.status === 401) {
        const errorData = await response.json();
        if (errorData.token_expired) {
          localStorage.removeItem('token');
          alert('Your session has expired. Please login again.');
          window.location.href = '/login';
          return;
        }
      }
      
      if (response.ok) {
        onConnected(); // Refresh status
        alert('LinkedIn disconnected successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to disconnect: ${error.error || error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error disconnecting LinkedIn:', error);
      alert('Error disconnecting LinkedIn. Please try again.');
    }
  };

  return (
    <button 
      className="connect-button" 
      onClick={connected ? handleDisconnect : handleConnect}
      style={{
        backgroundColor: connected ? '#dc3545' : '#0077b5',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px'
      }}
    >
      {connected ? 'Disconnect LinkedIn' : 'Connect LinkedIn'}
    </button>
  );
};

export default LinkedInConnect;