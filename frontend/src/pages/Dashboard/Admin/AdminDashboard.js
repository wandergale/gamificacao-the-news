import style from "./AdminDashboard.module.css";

import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [filteredStats, setFilteredStats] = useState(null);
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
        setFilteredStats(data);
      })
      .catch(console.error);
  };

  if (!stats) return <p>Carregando...</p>;

  return (
    <div className={style.container}>
      <h2 id={style.painel}>Painel Administrativo</h2>

      <div className={style.general_metrics}>
        <h3>Métricas Gerais</h3>
        <p className={style.stats}>
          <strong>Total de Usuários:</strong>{" "}
          {filteredStats ? filteredStats.length : stats.total_usuarios}
        </p>
        <p className={style.stats}>
          <strong>Usuários com Streak:</strong>{" "}
          {filteredStats
            ? filteredStats.filter((user) => user.current_streak > 0).length
            : stats.usuarios_com_streak}
        </p>
        <p className={style.stats}>
          <strong>Média de Streaks:</strong>{" "}
          {filteredStats
            ? (
                filteredStats.reduce(
                  (acc, user) => acc + user.current_streak,
                  0
                ) / filteredStats.length || 0
              ).toFixed(2)
            : stats.media_streaks}
        </p>
      </div>

      <div className={style.top_readers}>
        <h3>Top 10 Leitores Mais Engajados</h3>
        <ul className={style.ul_top}>
          {ranking.map((user, index) => (
            <li className={style.li_top} key={index}>
              {user.email} - Streak Atual: {user.current_streak} | Máx:{" "}
              {user.longest_streak}
            </li>
          ))}
        </ul>
      </div>

      <div className={style.filter_stats}>
        <h3>Filtrar Estatísticas</h3>
        <label>Data Início:</label>
        <input
          className={style.input_filter}
          type="date"
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label>Data Fim:</label>
        <input
          className={style.input_filter}
          type="date"
          onChange={(e) => setEndDate(e.target.value)}
        />
        <label>Status:</label>
        <select onChange={(e) => setStreakStatus(e.target.value)}>
          <option value="">Todos</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </select>
        <button className={style.btn_filter} onClick={handleFilter}>
          Filtrar
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
