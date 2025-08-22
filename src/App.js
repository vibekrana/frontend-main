import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ContentCreation from './components/ContentCreation';
import Register from './components/Register';
import Survey from './components/Survey';  // Add this import

const App = () => {
  const [user, setUser] = useState(null);

  // Check if the user is already logged in (e.g., token exists in localStorage)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // You could verify the token with the backend here, but for now, assume it's valid
      setUser({ username: 'admin' }); // Replace with actual user data from backend if needed
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/content" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/content" /> : <Register />}
        />

        {/* Add Survey Route */}
        <Route
          path="/survey"
          element={<Survey />}
        />

        <Route
          path="/content"
          element={
            user ? (
              <div>
                <div style={{ position: 'absolute', top: 10, right: 10 }}>
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#facc15',
                      color: '#1f2937',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: '600',
                    }}
                  >
                    Logout
                  </button>
                </div>
                <ContentCreation user={user} />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;