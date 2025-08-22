import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle theme and persist
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  // On load, check for saved theme
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') setIsDarkMode(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://4fqbpp1yya.execute-api.ap-south-1.amazonaws.com/prod/user/login',
        { username, password }
      );
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        onLogin(user);
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      setError('Invalid username or password');
      setIsLoading(false);
    }
  };

  return (
    <div className={`login-container ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Theme Toggle */}
      <button className="theme-toggle top-left" onClick={toggleTheme}>
        {isDarkMode ? '☀️ Light' : '🌙 Dark'}
      </button>

      {/* Logout Placeholder if needed */}
      <button className="logout-button top-right">Logout</button>

      {/* Floating Icons */}
      <div className="extra-icons">
        <span className="icon1">🚀</span>
        <span className="icon2">🤖</span>
        <span className="icon3">📊</span>
        <span className="icon4">💡</span>
      </div>

    <div className="login-box">
      <img src="/logo1922.png" alt="Login Logo" className="login-logo" />
      <h1 className="login-header">Marketing Bot</h1>
      <p className="login-subheader">Login</p>


        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="response-error"><div className="response-icon">!</div><div className="response-content"><p>{error}</p></div></div>}
          {success && <div className="response-success"><div className="response-icon">✓</div><div className="response-content"><p>{success}</p></div></div>}

          <button type="submit" className="post-button" disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : 'Login'}
          </button>

<p style={{ marginTop: "1rem", color: "#22d3ee" }}>
  New user? <a href="/register" style={{ color: "#facc15", fontWeight: "bold" }}>Register here</a>
</p>
        </form>
      </div>
    </div>
  );
};

export default Login;
