import style from "./UserDashboard.module.css";

import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [streak, setStreak] = useState(null);
  const [streakHistory, setStreakHistory] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.log("token not found");
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
          return Promise.all([
            fetch(
              `https://the-news-2a20.onrender.com/streaks?userId=${data.user.id}`
            ).then((res) => res.json()),
            fetch(
              `https://the-news-2a20.onrender.com/streak-history?userId=${data.user.id}`
            ).then((res) => res.json()),
          ]);
        } else {
          throw new Error("User not found");
        }
      })
      .then(([streakData, historyData]) => {
        setStreak(streakData);
        setStreakHistory(historyData);
      })
      .catch((error) => console.error("Erro:", error));
  }, []);

  if (!user) {
    return <p>Carregando...</p>;
  }
  // const streak = {
  //   current_streak: 1,
  //   longest_streak: 4,
  // };

  return (
    <div className={style.container}>
      {/* <h2>ola, {user.email}</h2> */}
      <img
        className={style.logo_img}
        src="https://app.thenewscc.com.br/thenews.webp"
        alt="logo"
      />
      <h2>Sua jornada de Leitura</h2>
      <p className={style.prog}>Acompanhe seu progresso diário</p>
      {streak ? (
        <div className={style.container}>
          <p>Streak Atual: {streak.current_streak} dias</p>
          <p>Maior Streak: {streak.longest_streak}</p>
           {/* leituras */}
           <h3>Histórico de leituras:</h3>
          <ul>
            {streakHistory.length > 0 ? (
              streakHistory.map((entry, index) => (
                <li key={index}>{new Date(entry.read_date).toLocaleDateString()}</li>
              ))
            ) : (
              <p>Nenhum histórico encontrado.</p>
            )}
          </ul>

          <p>Continue entrando diariamente para aumentar seu streak!</p>
          <div className={style.btn_wrapper}>
            <div className={style.btn}>
              <button onClick={<Navigate to="/" />}>Continuar Lendo</button>
            </div>
          </div>
        </div>
      ) : (
        <p>Carregando streak...</p>
      )}
    </div>
  );
};

export default UserDashboard;
