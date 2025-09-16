import React, { useEffect, useState } from "react";
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
  const [loadingBoards, setLoadingBoards] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setBearer(token);
    loadUser(Store.dispatch);

    const testBackend = async () => {
      if (!token) return console.warn("No token guardado, omitiendo prueba de backend.");
      setLoadingBoards(true);
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/boards`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Tableros obtenidos del backend:", res.data);
      } catch (error) {
        console.error("Error comunicándose con el backend:", error.response?.data || error.message);
      } finally {
        setLoadingBoards(false);
      }
    };
    testBackend();
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
      {loadingBoards && <div>Cargando tableros...</div>}
    </BrowserRouter>
  );
};

export default App;



