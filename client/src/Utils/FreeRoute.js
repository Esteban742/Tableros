import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const FreeRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user);

  if (user) {
    // Usuario logueado, redirigir a boards
    return <Navigate to="/boards" replace />;
  }

  return children;
};

export default FreeRoute;
