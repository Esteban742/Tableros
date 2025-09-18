import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../Services/userService";
import setBearer from "./setBearer";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const dispatch = useDispatch();
  const { userInfo, isAuthenticated, pending } = useSelector((state) => state.user);
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

  if (loading || pending) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px', color: '#666' }}>
        Cargando...
      </div>
    );
  }

  const isUserAuthenticated = isAuthenticated && userInfo && (userInfo._id || userInfo.id);

  return (
    <Route
      {...rest}
      render={(props) =>
        isUserAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default ProtectedRoute;

