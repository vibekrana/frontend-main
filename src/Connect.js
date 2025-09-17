import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LinkedInConnect from "./components/LinkedInConnect";
import InstagramConnect from "./components/InstagramConnect";
import "./components/Connect.css";

// Hardcoded endpoint for social status (same style as ContentCreation)
const API_SOCIAL_STATUS = "http://13.233.45.167:5000/social/status";

export default function Connect() {
  const [status, setStatus] = useState({
    linkedin: { connected: false, detail: null },
    instagram: { connected: false, detail: null },
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const token = localStorage.getItem("token");
  const appUser = useMemo(() => localStorage.getItem("username") || localStorage.getItem("appUser") || "defaultUser", []);
  const navigate = useNavigate();

  // Check if user is properly logged in
  useEffect(() => {
    console.log("Token:", token);
    console.log("App User:", appUser);
    
    if (!token || token === "null" || token === "undefined") {
      console.log("No valid token found, redirecting to login");
      navigate("/login");
      return;
    }
  }, [token, appUser, navigate]); // Fixed: Added appUser dependency

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDarkMode(true);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  // Memoize fetchStatus to prevent unnecessary re-renders
  const fetchStatus = useCallback(async () => {
    try {
      setErr("");
      setLoading(true);
      
      const currentToken = localStorage.getItem("token");
      if (!currentToken || currentToken === "null" || currentToken === "undefined") {
        console.log("No valid token during fetch, redirecting to login");
        navigate("/login");
        return;
      }
      
      console.log("Fetching status with token:", currentToken);
      const res = await axios.get(API_SOCIAL_STATUS, {
        headers: { Authorization: `Bearer ${currentToken}` },
        params: { app_user: appUser },
      });
      console.log("API Response:", res.data); // Debug response
      setStatus({
        linkedin: res.data.linkedin || { connected: false, detail: null },
        instagram: res.data.instagram || { connected: false, detail: null },
      });
    } catch (e) {
      console.error("Fetch status error:", e);
      
      if (e.response?.status === 401) {
        console.log("401 error - token expired or invalid, redirecting to login");
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("appUser");
        navigate("/login");
        return;
      }
      
      const errorMessage = e?.response?.data?.message || "Could not load connection status.";
      setErr(errorMessage);
      setStatus({
        linkedin: { connected: false, detail: null },
        instagram: { connected: false, detail: null },
      });
    } finally {
      setLoading(false);
      console.log("Loading state set to false");
    }
  }, [appUser, navigate]); // Fixed: Removed unnecessary 'token' dependency

  useEffect(() => {
    if (!appUser) {
      const u = new URLSearchParams(window.location.search).get("u");
      if (u) localStorage.setItem("username", u);
    }
    
    // Only fetch status if we have a valid token
    if (token && token !== "null" && token !== "undefined") {
      fetchStatus();
    }
  }, [appUser, fetchStatus, token]);

  const goToContent = () => {
    console.log("Button clicked - navigating to content creation");
    
    const currentToken = localStorage.getItem("token");
    console.log("Token check:", !!currentToken);
    
    if (!currentToken || currentToken === "null" || currentToken === "undefined") {
      console.warn("No token found, redirecting to login");
      navigate("/login");
      return;
    }
    
    // Always allow navigation to content - no connection requirement
    try {
      console.log("Navigating to /content");
      navigate("/content");
      console.log("Navigation called successfully");
    } catch (error) {
      console.error("Navigation error:", error);
      setErr("Failed to navigate to content page.");
    }
  };

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("appUser");
    navigate("/login");
  };

  // Don't render anything if no token
  if (!token || token === "null" || token === "undefined") {
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className={`login-container ${isDarkMode ? "dark" : "light"}`}>
      {/* Theme Toggle */}
      <button className="theme-toggle top-left" onClick={toggleTheme}>
        {isDarkMode ? "☀️ Light" : "🌙 Dark"}
      </button>

      {/* Logout Button */}
      <button className="logout-button top-right" onClick={handleLogout}>
        🚪 Logout
      </button>

      {/* Floating Icons */}
      <div className="extra-icons">
        <span className="icon1">🚀</span>
        <span className="icon2">🤖</span>
        <span className="icon3">📊</span>
        <span className="icon4">💡</span>
      </div>

      <div className="login-box" style={{ maxWidth: 720 }}>
        <img src="/logo1922.png" alt="Logo" className="login-logo" />
        <h1 className="login-header">Connect Your Social Accounts</h1>
        <p className="login-subheader">Link your profiles for seamless auto-posting</p>

        {err && (
          <div className="response-error" style={{ marginTop: 10 }}>
            <div className="response-icon">!</div>
            <div className="response-content">
              <p>{err}</p>
            </div>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginTop: 16,
          }}
        >
          <div
            className={`platform-card ${status.linkedin.connected ? "selected" : ""}`}
            style={{ padding: 16 }}
          >
            <div className="platform-content">
              <span className="platform-name">LinkedIn</span>
              <p style={{ opacity: 0.9, marginTop: 6, fontSize: 14 }}>
                {status.linkedin.connected
                  ? `Connected (${
                      status.linkedin.detail?.preferred_posting_urn?.includes("organization")
                        ? "Organization"
                        : "Personal"
                    })`
                  : "Not connected"}
              </p>
            </div>
            <LinkedInConnect
              appUser={appUser}
              onConnected={fetchStatus}
              connected={status.linkedin.connected}
            />
          </div>

          <div
            className={`platform-card ${status.instagram.connected ? "selected" : ""}`}
            style={{ padding: 16 }}
          >
            <div className="platform-content">
              <span className="platform-name">Instagram</span>
              <p style={{ opacity: 0.9, marginTop: 6, fontSize: 14 }}>
                {status.instagram.connected
                  ? "Connected (Business/Creator)"
                  : "Not connected"}
              </p>
            </div>
            <InstagramConnect
              appUser={appUser}
              onConnected={fetchStatus}
              connected={status.instagram.connected}
            />
          </div>
        </div>

        <div className="form-actions" style={{ marginTop: 24 }}>
          <button
            className="post-button"
            onClick={goToContent}
            disabled={loading}  // Only disabled during loading
            title="Continue to content"
          >
            Continue to Content
          </button>
          <button className="reset-button" type="button" onClick={fetchStatus}>
            Refresh Status
          </button>
        </div>

        <p style={{ marginTop: 10, fontSize: 12, opacity: 0.8 }}>
          Tip: If your LinkedIn has a Page where you're an admin, we'll auto-select
          the org URN; else we use your personal URN.
        </p>

        {/* Debug info */}
        <div style={{ marginTop: 20, fontSize: 10, opacity: 0.5 }}>
          Debug: Token exists: {!!token}, AppUser: {appUser}, LinkedIn: {status.linkedin.connected ? "Connected" : "Not connected"}
        </div>
      </div>
    </div>
  );
}