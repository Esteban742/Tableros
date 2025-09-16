import React, { useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

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

import axios from "axios";

const App = () => {
  useEffect(() => {
    // ======== Configuración inicial ========
    const token = localStorage.getItem("token");
    if (token) setBearer(token);
    loadUser(Store.dispatch);
    // =======================================

    // ======== PRUEBA DE BACKEND ========
    const testBackend = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;

        // 1️⃣ Traer tableros
        const boardsRes = await axios.get(`${apiUrl}/boards`);
        console.log("Tableros:", boardsRes.data);

        // 2️⃣ Traer listas
        const listsRes = await axios.get(`${apiUrl}/lists`);
        console.log("Listas:", listsRes.data);

        // 3️⃣ Traer tarjetas
        const cardsRes = await axios.get(`${apiUrl}/cards`);
        console.log("Tarjetas:", cardsRes.data);

        // 4️⃣ Intentar registrar un usuario de prueba
        const testUser = {
          username: "usuario_prueba",
          email: "prueba@example.com",
          password: "123456"
        };

        // Verificar si el usuario ya existe para no duplicar
        const usersRes = await axios.get(`${apiUrl}/users`);
        const userExists = usersRes.data.some(u => u.email === testUser.email);

        if (!userExists) {
          const registerRes = await axios.post(`${apiUrl}/users/register`, testUser, {
            headers: { "Content-Type": "application/json" }
          });
          console.log("Usuario de prueba registrado:", registerRes.data);
        } else {
          console.log("Usuario de prueba ya existe.");
        }

      } catch (error) {
        console.error("Error en la prueba de backend:", error.response?.data || error.message);
      }
    };

    testBackend();
    // ====================================

  }, []);

  return (
    <BrowserRouter>
      <Alert />
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/boards" />} />
        <ProtectedRoute exact path="/boards" component={Boards} />
        <ProtectedRoute exact path="/board/:id" component={Board} />
        <FreeRoute exact path="/login" component={Login} />
        <FreeRoute exact path="/register" component={Register} />
        <Route path="*" render={() => <Redirect to="/" />} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;


