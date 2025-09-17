// src/components/Login.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle theme and persist
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  // On load, check for saved theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDarkMode(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://4fqbpp1yya.execute-api.ap-south-1.amazonaws.com/prod/user/login",
        { username, password }
      );
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("username", user.username);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        onLogin(user);
        setIsLoading(false);
        window.location.href = "/connect";
      }, 1500);
    } catch (err) {
      setError("Invalid username or password");
      setIsLoading(false);
    }
  };

  return (
    <div className={`login-container-split ${isDarkMode ? "dark" : "light"}`}>
      {/* Theme Toggle */}
      <button className="theme-toggle top-left" onClick={toggleTheme}>
        {isDarkMode ? "☀️ Light" : "🌙 Dark"}
      </button>

      {/* Logout Placeholder */}
      <button className="logout-button top-right">Logout</button>

      {/* Floating Icons */}
      <div className="extra-icons">
        <span className="icon1">🚀</span>
        <span className="icon2">🤖</span>
        <span className="icon3">📊</span>
        <span className="icon4">💡</span>
      </div>

      {/* Main Content Split Layout */}
      <div className="login-split-content">
        {/* Left Side - Marketing Message */}
        <div className="marketing-section">
          <div className="marketing-content">
            <div className="brand-section">
              <img src="/logo1922.png" alt="Inikola Logo" className="marketing-logo" />
              <div className="brand-info">
                <h2 className="brand-name">INIKOLA</h2>
                <p className="brand-tagline">Presenting</p>
              </div>
            </div>
            
            <h1 className="marketing-title">
              INDIA'S FAVORITE
              <span className="marketing-highlight">MARKETING BOT</span>
              for accelerated business growth
            </h1>
            
            <p className="marketing-description">
              Inikola's Marketing Bot helps 1000+ businesses automate their social media presence. 
              Generate stunning content, schedule posts automatically, and grow your brand effortlessly 
              across Instagram, LinkedIn, and more platforms.
            </p>
            
            <div className="marketing-features">
              <div className="feature-item">
                <div className="feature-icon">🎨</div>
                <div className="feature-text">
                  <strong>AI-Powered Content Creation</strong>
                  <span>Generate professional images and captions</span>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">📱</div>
                <div className="feature-text">
                  <strong>Multi-Platform Posting</strong>
                  <span>Auto-post to Instagram, LinkedIn & more</span>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <div className="feature-text">
                  <strong>Smart Scheduling</strong>
                  <span>Optimize posting times for maximum reach</span>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="marketing-decorations">
              <div className="decoration-circle decoration-1"></div>
              <div className="decoration-circle decoration-2"></div>
              <div className="decoration-person person-1">
                <div className="person-avatar">👨‍💼</div>
              </div>
              <div className="decoration-person person-2">
                <div className="person-avatar">👩‍💻</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-section">
          <div className="login-form-container">
            <div className="login-header-section">
              <h2 className="login-form-title">Get started with your account</h2>
              <p className="login-form-subtitle">Sign in to access your marketing dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
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

              {error && (
                <div className="response-error">
                  <div className="response-icon">!</div>
                  <div className="response-content">
                    <p>{error}</p>
                  </div>
                </div>
              )}
              
              {success && (
                <div className="response-success">
                  <div className="response-icon">✓</div>
                  <div className="response-content">
                    <p>{success}</p>
                  </div>
                </div>
              )}

              <button type="submit" className="login-submit-button" disabled={isLoading}>
                {isLoading ? <div className="spinner"></div> : "GET STARTED"}
              </button>

              <div className="form-footer">
                <p>
                  New user?{" "}
                  <a href="/register" className="register-link">
                    Register here
                  </a>
                </p>
                
                <div className="social-login">
                  <span>or sign in using</span>
                  <div className="social-buttons">
                    <button type="button" className="social-btn google-btn">
                      <span className="social-icon">G</span>
                    </button>
                    <button type="button" className="social-btn linkedin-btn">
                      <span className="social-icon">in</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;