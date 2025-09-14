import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const FreeRoute = ({ component: Component, ...rest }) => {
  const { user, loading } = useSelector((state) => state.user);

  return (
    <Route
      {...rest}
      render={(props) =>
        loading ? (
          <div>Loading...</div>
        ) : user ? (
          <Redirect to="/boards" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default FreeRoute;
