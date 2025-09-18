// ProtectedRoute.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { loadUser } from "../Services/userService"; // Ajusta según tu estructura

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      await dispatch(loadUser()); // Carga el usuario desde backend
      setCheckingAuth(false);
    };
    fetchUser();
  }, [dispatch]);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (checkingAuth || loading) {
          return <div>⏳ Cargando usuario...</div>;
        }
        const isAuthenticated = !!user?.email;
        if (!isAuthenticated) {
          return <Redirect to="/login" />;
        }
        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;

