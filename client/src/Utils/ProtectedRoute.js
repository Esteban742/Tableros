// client/src/Utils/ProtectedRoute.js
import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../Services/userService";
import setBearer from "./setBearer";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false); // no hay token, no cargamos usuario
      return;
    }

    setBearer(token);

    // Cargar usuario y esperar a que termine
    (async () => {
      await loadUser(dispatch);
      setLoading(false);
    })();
  }, [dispatch]);

  if (loading) return <div>Cargando...</div>; // opcional: spinner

  return (
    <Route
      {...rest}
      render={(props) =>
        user && user.id ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default ProtectedRoute;
