import style from './UserDashboard.module.css'

import { useState, useEffect } from "react";

const UserDashboard = () => {
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
        return res.json();
      })
      .then((data) => {
        console.log("DATA: ", data);
        if (data.user) {
          setUser(data.user);
          return fetch(
            `https://the-news-2a20.onrender.com/streaks?userId=${data.user.id}`
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
    <div className={style.container}>
      <img
        src="https://app.thenewscc.com.br/thenews.webp"
        alt="logo"
        width="30px"
      />
      <h2>Sua jornada de Leitura</h2>
      <p>Acompanhe seu progresso diário</p>
      {streak ? (
        <div className={style.container_streaks}>
          <p>Streak Atual: {streak.current_streak} dias</p>
          <p>Maior Streak: {streak.longest_streak}</p>

          <p>Continue entrando diariamente para aumentar seu streak!</p>
        </div>
      ) : (
        <p>Carregando streak...</p>
      )}
    </div>
  );
};

export default UserDashboard;
