// src/routes/Protected.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function Protected({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
