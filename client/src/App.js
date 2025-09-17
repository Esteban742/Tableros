import React, { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setBearer(token);
        try {
          await loadUser(Store.dispatch);
        } catch (err) {
          console.error("Error cargando usuario al iniciar la app:", err);
          localStorage.removeItem("token"); // limpiar token inválido
          setBearer(null);
        }
      }
      setLoading(false);
    };

    initUser();
  }, []);

  if (loading) return <div>Cargando usuario...</div>; // espera antes de renderizar rutas

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



