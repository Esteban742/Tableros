// src/Utils/ProtectedRoute.js
import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../Services/userService"; // Asegúrate que tu thunk esté correcto
import setBearer from "./setBearer"; // Función que setea token en axios

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);

  // Cargar usuario al montar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setBearer(token); // setea Authorization header
    dispatch(loadUser()); // thunk que actualiza Redux
  }, [dispatch]);

  // Verificamos si está cargando
  if (loading) {
    return <div>⏳ Cargando usuario...</div>;
  }

  // Validamos autenticación
  const isAuthenticated = !!user?.email;

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default ProtectedRoute;


