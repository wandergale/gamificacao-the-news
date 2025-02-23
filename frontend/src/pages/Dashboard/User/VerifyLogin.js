import { useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import dotenv from "dotenv";

dotenv.config();

export const VerifyLogin = () => {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      verifyToken(token);
    } else {
      alert("Token inválido");
      navigate("/");
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const res = await fetch(
        `${apiUrl}/auth?token=${token}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        const data = await res.json();

        localStorage.setItem("authToken", token);
        localStorage.setItem("isAdmin", data.user.is_admin);

        data.user.is_admin
          ? navigate("/admin-dashboard")
          : navigate("/user-dashboard");
      } else {
        alert("Erro ao autenticar");
        navigate("/");
      }
    } catch (error) {
      console.error("Erro ao autenticar:", error);
      navigate("/");
    }
  };

  return <p>Verificando login...</p>;
};

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to={`/`} />;
};

export const ProtectAdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return isAdmin ? children : <Navigate to="/" />;
};
