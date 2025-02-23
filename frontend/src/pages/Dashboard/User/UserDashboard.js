import style from "./UserDashboard.module.css";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();

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

  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className={style.container}>
      <img
        src="https://app.thenewscc.com.br/thenews.webp"
        alt="logo the news"
      />
      <h2>Sua Jornada de Leitura</h2>
      <p className={style.progres}>Acompanhe seu progresso diário</p>
      {streak && streak ? (
        <div className={style.stats}>
          <div className={style.card}>
            <div className={style.currentStreak}>
              <p className={style.emoji}>🌱</p>
              <p>{streak.current_streak}</p>
            </div>
            <span>Dias Seguidos</span>
          </div>

          <div className={style.card}>
            <div className={style.currentStreak}>
              <p className={style.emoji}>🏆</p>
              <p>{streak.longest_streak}</p>
            </div>
            <span>Dias Seguidos</span>
          </div>
        </div>
      ) : (
        <p>Carregando streaks</p>
      )}
      {streakHistory && (
        <div className={style.weeklyProgress}>
          <h3>Progresso da Semana</h3>
          <div className={style.week}>
            {weekDays.map((day, index) => (
              <div
                key={index}
                className={`${style.dayBox} ${
                  streakHistory[index] ? style.active : ""
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      )}
      <p className={style.cont}>
        Continue entrando diariamente para aumentar seu streak!
      </p>
      <div className={style.btn_wrapper}>
        <div className={style.btn}>
          <button onClick={handleClick}>Continuar Lendo</button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
