import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const VerifyLogin = () => {
  const navigate = useNavigate();

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
      const res = await fetch("https://the-news-2a20.onrender.com/auth", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

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
