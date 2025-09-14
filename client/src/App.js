import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "./Components/Pages/IndexPage/Index";
import Login from "./Components/Pages/LoginPage/Login";
import Register from "./Components/Pages/RegisterPage/Register";
import Boards from "./Components/Pages/BoardsPage/Boards";
import Board from "./Components/Pages/BoardPage/Board";
import Alert from "./Components/AlertSnackBar";

import ProtectedRoute from "./Utils/ProtectedRoute";
import FreeRoute from "./Utils/FreeRoute";

import { loadUser } from "./Services/userService";
import Store from "./Redux/Store";
import setBearer from "./Utils/setBearer";

const App = () => {
  const [loading, setLoading] = useState(true); // Para esperar loadUser
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initApp = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setBearer(token);
        try {
          await loadUser(Store.dispatch);
          setUser(Store.getState().user.currentUser); // Ajusta según tu slice
        } catch (err) {
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };
    initApp();
  }, []);

  if (loading) return <div>Cargando...</div>; // Mientras carga usuario

  return (
    <BrowserRouter>
      <Alert />
      <Routes>
        {/* Rutas protegidas */}
        <Route
          path="/boards"
          element={
            user ? <Boards /> : <Navigate replace to="/login" />
          }
        />
        <Route
          path="/board/:id"
          element={
            user ? <Board /> : <Navigate replace to="/login" />
          }
        />

        {/* Rutas públicas */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate replace to="/boards" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate replace to="/boards" />}
        />
        <Route
          path="/"
          element={<Index />}
        />

        {/* Ruta fallback */}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;



