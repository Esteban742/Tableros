// client/src/Utils/FreeRoute.js
import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../Services/userService";
import setBearer from "./setBearer";

const FreeRoute = ({ component: Component, ...rest }) => {
  const dispatch = useDispatch();
  const { userInfo, isAuthenticated } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    setBearer(token);

    (async () => {
      if (!isAuthenticated || !userInfo) {
        await loadUser(dispatch);
      }
      setLoading(false);
    })();
  }, [dispatch, isAuthenticated, userInfo]);

  if (loading) return <div>Cargando...</div>; // opcional: spinner

  const isUserLoggedIn = isAuthenticated && userInfo && (userInfo._id || userInfo.id);

  return (
    <Route
      {...rest}
      render={(props) =>
        !isUserLoggedIn ? <Component {...props} /> : <Redirect to="/boards" />
      }
    />
  );
};

export default FreeRoute;



