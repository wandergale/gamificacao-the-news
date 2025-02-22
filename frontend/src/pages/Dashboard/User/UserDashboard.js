import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const UserDashboard = () => {
  // const [searchParams] = useSearchParams();
  // const token = searchParams.get("token");
  const [user, setUser] = useState(null);
  const [streak, setStreak] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.log("token not found");
      return;
    }

    fetch(`https://the-news-2a20.onrender.com/auth?token=${token}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("User not found");
        }
        return res.json(); // Retorna res.json()
      })
      .then((data) => {
        console.log("DATA: ", data);
        if (data.user) {
          setUser(data.user);
          return fetch(
            `https://the-news-2a20.onrender.com/streak?userId=${data.user.id}`
          );
        } else {
          throw new Error("User not found");
        }
      })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro on laoding streak");
        }
        return res.json();
      })
      .then(setStreak)
      .catch((error) => console.error("Erro:", error));
  }, []);

  console.log(user);
  if (!user) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h2>Olá, {user.email}!</h2>
      {streak ? (
        <>
          <p>Streak Atual: {streak.current_streak} dias</p>
          <p>Maior Streak: {streak.longest_streak}</p>
        </>
      ) : (
        <p>Carregando streak...</p>
      )}
    </div>
  );
};

export default UserDashboard;
