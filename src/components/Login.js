// src/components/Login.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  // Toggle theme and persist
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    
    if (newMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  // On load, check for saved theme and existing token
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark");
    }

    // If user is already logged in, redirect to connect
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/connect", { replace: true });
    }
  }, [navigate]);

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
      
      // Call onLogin if provided
      if (onLogin) {
        onLogin(user);
      }
      
      // Navigate after a brief delay for UX
      setTimeout(() => {
        setIsLoading(false);
        navigate("/connect", { replace: true });
      }, 1000);
    } catch (err) {
      setError("Invalid username or password");
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Watermark Container */}
      <div className="watermark-container">
        <div className="watermark-text watermark-1">MARKETING BOT</div>
        <div className="watermark-text watermark-2">MARKETING BOT</div>
        <div className="watermark-icon icon-1">🚀</div>
        <div className="watermark-icon icon-2">💡</div>
        <div className="watermark-icon icon-3">📊</div>
      </div>

      {/* Theme Toggle */}
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      {/* Main Container */}
      <div className="login-container">
        <div className="login-wrapper">
          
          {/* Left Side - Branding */}
          <div className="brand-section">
            <div className="brand-header">
              <img 
                src="/123.jpg" 
                alt="Marketing Bot Logo" 
                className="brand-logo-img"
              />
              <div className="brand-info">
                <h1>Marketing Bot</h1>
                <p>by INIKOLA</p>
              </div>
            </div>

            <h2 className="brand-title">
              START YOUR
              <span className="brand-highlight"> MARKETING REVOLUTION</span>
              <br />Join the AI-Powered Future
            </h2>

            <p className="brand-description">
              Transform your business with the power of AI. Join 1000+ forward-thinking entrepreneurs 
              who are already dominating social media. One platform, unlimited possibilities – create, 
              schedule, and scale your brand like never before.
            </p>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🎨</div>
                <h3>AI-Powered Content Creation</h3>
                <p>Generate professional images and captions</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h3>Multi-Platform Posting</h3>
                <p>Auto-post to Instagram, LinkedIn & more</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>Smart Scheduling</h3>
                <p>Optimize posting times for maximum reach</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Analytics Dashboard</h3>
                <p>Track performance & engagement metrics</p>
              </div>
            </div>

            <div className="social-proof">
              <div className="proof-icon">🚀</div>
              <div className="proof-content">
                <h4>Join 1000+ Growing Businesses</h4>
                <p>Trusted by startups and enterprises worldwide for marketing automation</p>
              </div>
            </div>

            {/* About Section */}
            <div className="about-section">
              <h3>About Marketing Bot</h3>
              <p>
                Marketing Bot is an AI-powered automation platform designed to revolutionize 
                your social media marketing. Our advanced algorithms help you create engaging 
                content, optimize posting schedules, and grow your audience across multiple platforms.
              </p>
              <p>
                Built with cutting-edge technology, we empower businesses of all sizes to 
                maintain a consistent and professional social media presence without the hassle 
                of manual content creation and scheduling.
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="login-section">
            <div className="login-header">
              <h2>Get started with your account</h2>
              <p>Sign in to access your marketing dashboard</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
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
                <div className="error-message">
                  ⚠️ {error}
                </div>
              )}

              {success && (
                <div className="success-message">
                  ✓ {success}
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : (
                  "GET STARTED"
                )}
              </button>
            </form>

            <div className="form-footer">
              <p>
                New user?{" "}
                <a href="/register">
                  Register here
                </a>
              </p>
            </div>

            <div className="stats-container">
              <div className="stat-item">
                <div className="stat-value">10+</div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">50+</div>
                <div className="stat-label">Posts Created</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">98%</div>
                <div className="stat-label">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="login-footer">
        <div className="footer-content">
          <p>&copy; 2025 Marketing Bot by INIKOLA. All Rights Reserved.</p>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <span>•</span>
            <a href="/terms">Terms of Service</a>
            <span>•</span>
            <a href="/contact">Contact Us</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Login;