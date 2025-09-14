import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * Para rutas que solo deberían verse si NO hay usuario logueado,
 * como login o registro.
 */
const FreeRoute = ({ component: Component }) => {
  const { user } = useSelector((state) => state.user);

  if (user) {
    // Ya está logueado: redirige a /boards
    return <Navigate to="/boards" replace />;
  }

  return <Component />;
};

export default FreeRoute;

