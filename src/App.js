import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import ContentCreation from "./components/ContentCreation";
import Register from "./components/Register";
import Survey from "./components/Survey";
import Connect from "./Connect"; // Import the Connect component

const App = () => {
  const [user, setUser] = useState(null);

  // Check if the user is already logged in (e.g., token exists in localStorage)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // You could verify the token with the backend here, but for now, assume it's valid
      setUser({ username: localStorage.getItem("username") || "admin" }); // Use stored username or default
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("appUser");
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            user ? <Navigate to="/connect" /> : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/connect" /> : <Register />}
        />

        {/* Add Survey Route */}
        <Route path="/survey" element={<Survey />} />

        <Route
          path="/connect"
          element={
            user ? (
              <div>
                <div style={{ position: "absolute", top: 10, right: 10 }}>
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#facc15",
                      color: "#1f2937",
                      border: "none",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Logout
                  </button>
                </div>
                <Connect />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/content"
          element={
            user ? (
              <div>
                <div style={{ position: "absolute", top: 10, right: 10 }}>
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#facc15",
                      color: "#1f2937",
                      border: "none",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      fontWeight: "600",
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