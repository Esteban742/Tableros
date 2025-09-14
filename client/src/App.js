import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setBearer(token);
    loadUser(Store.dispatch);
  }, []);

  return (
    <BrowserRouter>
      <Alert />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/boards" element={<Boards />} />
          <Route path="/board/:id" element={<Board />} />
        </Route>
        <Route element={<FreeRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Index />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
