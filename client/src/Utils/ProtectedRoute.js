import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { user, loading } = useSelector((state) => state.user);

  return (
    <Route
      {...rest}
      render={(props) =>
        loading ? (
          <div>Loading...</div>
        ) : user ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default ProtectedRoute;
