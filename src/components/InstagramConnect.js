// src/components/InstagramConnect.js
import React from 'react';

const InstagramConnect = ({ appUser, onConnected, connected }) => {
  const handleConnect = () => {
    // TODO: Implement actual OAuth redirect to Instagram (via Facebook Graph API)
    // Example placeholder:
    const clientId = 'YOUR_FACEBOOK_APP_ID'; // Replace with actual Facebook App ID (for Instagram)
    const redirectUri = encodeURIComponent('http://localhost:3000/instagram-callback'); // Your callback URL
    const scope = encodeURIComponent('pages_show_list instagram_basic instagram_manage_comments'); // Adjust scopes for Instagram Business/Creator
    const state = encodeURIComponent(appUser || 'random_state'); // Use appUser or generate random state for security
    const url = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=${state}`;
    
    // Redirect to Facebook/Instagram auth page
    window.location.href = url;

    // After callback (handled in backend later), call onConnected() to refresh status
  };

  const handleDisconnect = () => {
    // TODO: Implement disconnect logic, e.g., call backend API to revoke token
    alert('Disconnecting Instagram (placeholder)');
    onConnected(); // Refresh status after disconnect
  };

  return (
    <button 
      className="connect-button" 
      onClick={connected ? handleDisconnect : handleConnect}
    >
      {connected ? 'Disconnect' : 'Connect'} Instagram
    </button>
  );
};

export default InstagramConnect;