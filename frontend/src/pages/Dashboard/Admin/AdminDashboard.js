import style from "./AdminDashboard.module.css";

import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [streakStatus, setStreakStatus] = useState("");

  useEffect(() => {
    fetch("https://the-news-2a20.onrender.com/admin/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("https://the-news-2a20.onrender.com/admin/ranking")
      .then((res) => res.json())
      .then(setRanking)
      .catch(console.error);
  }, []);

  const handleFilter = () => {
    fetch(
      `https://the-news-2a20.onrender.com/admin/stats/filter?startDate=${startDate}&endDate=${endDate}&streakStatus=${streakStatus}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("DADOS RECEBIDOS: ", data);
        setStats(data);
      })
      .catch(console.error);
  };

  if (!stats) return <p>Carregando...</p>;

  return (
    <div className={style.container}>
      <h2>Painel Administrativo</h2>

      <div>
        <h3>Métricas Gerais</h3>
        <p className={style.streaks}>
          <strong>Total de Usuários:</strong> {stats.total_usuarios}
        </p>
        <p className={style.streaks}>
          <strong>Usuários com Streak:</strong> {stats.usuarios_com_streak}
        </p>
        <p className={style.streaks}>
          <strong>Média de Streaks:</strong> {stats.media_streaks}
        </p>
      </div>

      <div>
        <h3>Top 10 Leitores Mais Engajados</h3>
        <ul>
          {ranking.map((user, index) => (
            <li key={index}>
              {user.email} - Streak Atual: {user.current_streak} | Máx:{" "}
              {user.longest_streak}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Filtrar Estatísticas</h3>
        <label>Data Início:</label>
        <input type="date" onChange={(e) => setStartDate(e.target.value)} />
        <label>Data Fim:</label>
        <input type="date" onChange={(e) => setEndDate(e.target.value)} />
        <label>Status:</label>
        <select onChange={(e) => setStreakStatus(e.target.value)}>
          <option value="">Todos</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </select>
        <button onClick={handleFilter}>Filtrar</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
