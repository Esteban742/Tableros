import React, { useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

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
    console.log("Token antes de loadUser:", token);

    if (!token) return; // No hay token, no hacer nada

    setBearer(token); // Primero setear el header

    console.log("Axios headers:", axios.defaults.headers.common);

    // Cargar usuario y manejar errores sin romper la app
    (async () => {
      const user = await loadUser(Store.dispatch);
      if (!user) console.log("Usuario no cargado al iniciar la app");
    })();
  }, []);

  return (
    <BrowserRouter>
      <Alert />
      <Switch>
        {/* Ruta raíz: redirigir según autenticación */}
        <Route
          exact
          path="/"
          render={() => {
            const token = localStorage.getItem("token");
            return token ? <Redirect to="/boards" /> : <Redirect to="/login" />;
          }}
        />

        {/* Rutas protegidas */}
        <ProtectedRoute exact path="/boards" component={Boards} />
        <ProtectedRoute exact path="/board/:id" component={Board} />

        {/* Rutas libres */}
        <FreeRoute exact path="/login" component={Login} />
        <FreeRoute exact path="/register" component={Register} />

        {/* Ruta catch-all */}
        <Route path="*" render={() => <Redirect to="/" />} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;


