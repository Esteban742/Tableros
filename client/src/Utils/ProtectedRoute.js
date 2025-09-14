import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * Protege rutas que requieren usuario logueado.
 * Si no hay usuario, redirige al login.
 */
const ProtectedRoute = ({ component: Component }) => {
  const { user } = useSelector((state) => state.user);

  if (!user) {
    // No hay usuario logueado: redirige a /login
    return <Navigate to="/login" replace />;
  }

  return <Component />;
};

export default ProtectedRoute;
