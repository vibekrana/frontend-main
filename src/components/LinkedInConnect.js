import React, { useEffect, useState } from 'react';

const LinkedInConnect = ({ appUser, onConnected, connected, connectionDetails = null }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'linkedin_callback') {
        setIsConnecting(false);
        
        if (event.data.success) {
          const { 
            posting_method, 
            organization_count, 
            has_org_access, 
            person_urn, 
            org_urn, 
            message 
          } = event.data;
          
          setConnectionStatus({
            success: true,
            posting_method,
            organization_count: organization_count || 0,
            has_org_access: has_org_access || false,
            person_urn,
            org_urn,
            message: message || 'Connected successfully'
          });

          let successMessage = `LinkedIn connected successfully!\n`;
          successMessage += `Posting Method: ${posting_method}\n`;
          
          if (has_org_access && organization_count > 0) {
            successMessage += `Organizations Found: ${organization_count}\n`;
            successMessage += `Company Pages Detected: Yes\n`;
            successMessage += `Primary Org URN: ${org_urn || 'None'}`;
          } else {
            successMessage += `Will post to: Personal Profile\n`;
            successMessage += `Person URN: ${person_urn}`;
          }
          
          alert(successMessage);
          onConnected();
          
        } else {
          setConnectionStatus({
            success: false,
            error: event.data.error
          });
          alert(`LinkedIn connection failed: ${event.data.error}`);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onConnected]);

  const handleConnect = () => {
    setIsConnecting(true);
    setConnectionStatus(null);
    
    const clientId = '86geycovoa141y';
    const redirectUri = encodeURIComponent('http://13.233.45.167:5000/social/linkedin/callback');
    
    const scopes = [
      'r_basicprofile',
      'w_member_social',
      'r_organization_social',
      'w_organization_social',
      'rw_organization_admin',
      'r_organization_followers',
      'r_organization_social_feed',
      'w_organization_social_feed',
      'r_member_profileAnalytics',
      'r_member_postAnalytics'
    ].join(' ');
    
    const scope = encodeURIComponent(scopes);
    const state = encodeURIComponent(appUser);
    
    const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
    
    console.log('LinkedIn Auth - Requesting scopes:', scopes);
    
    const popup = window.open(url, 'linkedin-auth', 'width=600,height=700,scrollbars=yes,resizable=yes');
    
    if (!popup) {
      alert('Popup blocked. Please allow popups for this site and try again.');
      setIsConnecting(false);
      return;
    }
    
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        setIsConnecting(false);
        setTimeout(() => {
          onConnected();
        }, 1000);
      }
    }, 1000);
  };

  const handleDisconnect = async () => {
    if (!window.confirm('Are you sure you want to disconnect LinkedIn?')) {
      return;
    }

    try {
      setIsConnecting(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login again to disconnect LinkedIn.');
        window.location.href = '/login';
        return;
      }

      console.log('Disconnecting LinkedIn for user:', appUser);

      const response = await fetch('http://13.233.45.167:5000/social/linkedin/disconnect', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          app_user: appUser,
          platform: 'linkedin'  // Added platform identifier
        })
      });
      
      const result = await response.json();
      console.log('Disconnect response:', result);
      
      if (response.status === 401) {
        if (result.token_expired) {
          localStorage.removeItem('token');
          alert('Your session has expired. Please login again.');
          window.location.href = '/login';
          return;
        }
      }
      
      if (response.ok && result.success) {
        setConnectionStatus(null);
        alert('LinkedIn disconnected successfully!');
        onConnected(); // Refresh connection status
      } else {
        const errorMessage = result.error || result.message || 'Unknown error occurred';
        console.error('Disconnect failed:', errorMessage);
        alert(`Failed to disconnect LinkedIn: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error disconnecting LinkedIn:', error);
      alert(`Error disconnecting LinkedIn: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const getConnectionInfo = () => {
    if (!connected || !connectionDetails) return null;

    const { detail } = connectionDetails;
    if (!detail) return null;

    const { posting_method, has_org_access, organization_count = 0, user_urn, org_urn } = detail;
    
    return (
      <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
        <div><strong>Method:</strong> {posting_method || 'Personal Profile'}</div>
        {has_org_access && organization_count > 0 ? (
          <>
            <div><strong>Organizations:</strong> {organization_count}</div>
            <div><strong>Primary Org URN:</strong> {org_urn || 'N/A'}</div>
          </>
        ) : (
          <div><strong>Person URN:</strong> {user_urn || 'Personal Profile'}</div>
        )}
      </div>
    );
  };

  return (
    <div>
      <button 
        onClick={connected ? handleDisconnect : handleConnect}
        disabled={isConnecting}
        style={{
          color: 'white',
          border: 'none',
          padding: '10px 16px',
          borderRadius: '6px',
          cursor: isConnecting ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          backgroundColor: connected ? '#dc3545' : '#0077b5',
          opacity: isConnecting ? 0.7 : 1
        }}
      >
        {isConnecting ? (connected ? 'Disconnecting...' : 'Connecting...') : (connected ? 'Disconnect LinkedIn' : 'Connect LinkedIn')}
      </button>
      
      {getConnectionInfo()}
      
      {connectionStatus && (
        <div style={{ 
          marginTop: '8px', 
          padding: '8px', 
          borderRadius: '4px',
          fontSize: '12px',
          backgroundColor: connectionStatus.success ? '#d4edda' : '#f8d7da',
          color: connectionStatus.success ? '#155724' : '#721c24'
        }}>
          {connectionStatus.success ? (
            <div>
              <strong>Connected!</strong><br/>
              {connectionStatus.has_org_access && connectionStatus.organization_count > 0 ? 
                `Org Pages: ${connectionStatus.organization_count} detected` : 
                'Personal Profile Only'
              }
            </div>
          ) : (
            <div><strong>Failed:</strong> {connectionStatus.error}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default LinkedInConnect;