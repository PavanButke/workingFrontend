import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function PrivateRouter({ children, ...rest }) {
  const token = window.localStorage.getItem("userInfo");
  const location = useLocation();

  return token ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default PrivateRouter;
  