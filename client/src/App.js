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
    // ===== Configuración inicial =====
    const token = localStorage.getItem("token");
    if (token) setBearer(token);
    loadUser(Store.dispatch);

    // ===== Prueba de comunicación con backend =====
    const testBackend = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;

        // Hacer peticiones de forma segura con timeout
        const axiosInstance = axios.create({ timeout: 5000 });

        // Traer tableros
        const boardsRes = await axiosInstance.get(`${apiUrl}/boards`);
        console.log("Tableros:", boardsRes.data);

        // Traer listas
        const listsRes = await axiosInstance.get(`${apiUrl}/lists`);
        console.log("Listas:", listsRes.data);

        // Traer tarjetas
        const cardsRes = await axiosInstance.get(`${apiUrl}/cards`);
        console.log("Tarjetas:", cardsRes.data);
      } catch (error) {
        console.error("Error comunicándose con el backend:", error.response?.data || error.message);
      }
    };

    // Ejecutar prueba **solo si estamos en producción** para evitar problemas en desarrollo
    if (process.env.NODE_ENV === "production") {
      testBackend();
    }
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



