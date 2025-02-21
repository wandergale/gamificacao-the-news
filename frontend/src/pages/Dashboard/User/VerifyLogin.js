import { useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";

export const VerifyLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    console.log("PARAMS: ", params)
    const token = params.get("token");

    if (token) {
      verifyToken(token);
    } else {
      alert("Token inválido");
      navigate("/");
    }
  }, []);

  const verifyToken = async (token) => {
    console.log(token)
    try {
      const res = await fetch("https://the-news-2a20.onrender.com/auth", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log(res);

      const data = await res.json();
      console.log("DATA: ", data)

      if (res.ok) {
        localStorage.setItem("authToken", token);
        navigate("/user-dashboard");
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
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};
