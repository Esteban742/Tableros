// ProtectedRoute.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { loadUser } from "../Services/userService"; // Ajusta según tu estructura

const ProtectedRoute = () => {
  const dispatch = useDispatch();

  // Estado del usuario desde Redux
  const { user, loading } = useSelector((state) => state.user);

  // Estado local para manejar la carga inicial
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      await dispatch(loadUser()); // Carga el usuario desde backend
      setCheckingAuth(false);     // Termina de chequear autenticación
    };

    fetchUser();
  }, [dispatch]);

  if (checkingAuth || loading) {
    // Mostramos un loading mientras se carga el usuario
    return <div>⏳ Cargando usuario...</div>;
  }

  // Verificamos si hay un usuario válido
  const isAuthenticated = !!user?.email;

  if (!isAuthenticated) {
    // Redirigimos al login si no hay usuario
    return <Navigate to="/login" replace />;
  }

  // Usuario autenticado, mostramos las rutas hijas
  return <Outlet />;
};

export default ProtectedRoute;

