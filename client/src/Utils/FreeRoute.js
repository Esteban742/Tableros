import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const FreeRoute = ({ component: Component, ...rest }) => {
  const { user } = useSelector((state) => state.user);

  return (
    <Route
      {...rest}
      render={(props) =>
        !user ? <Component {...props} /> : <Redirect to="/boards" />
      }
    />
  );
};

export default FreeRoute;

