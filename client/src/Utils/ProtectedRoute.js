import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user);

  if (!user) {
    // No hay usuario, redirigir a login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
