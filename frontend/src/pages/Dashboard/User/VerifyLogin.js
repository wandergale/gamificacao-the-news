import { useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";

export const VerifyLogin = () => {
  const [searchParams] = useSearchParams();
  const navigate = Navigate();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } else {
      alert("Invalid token or expired");
      navigate("/login");
    }
  }, [token, navigate]);

  return <p>Verificando login...</p>;
};

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};
