import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
  // This component wraps private pages, only accessible using a valid accesstoken when user logs in
  // const { auth, user } = useAuth();
  const auth = JSON.parse(localStorage.getItem("auth"));
  const location = useLocation();

  return auth?.accessToken ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
