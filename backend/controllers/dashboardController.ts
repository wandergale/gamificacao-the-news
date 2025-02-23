import { Request, Response } from "express";
import pool from "../config/db";

export const getGeneralStats = async (req: Request, res: Response) => {
  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(DISTINCT users.id) AS total_usuarios,
        COUNT(DISTINCT streaks.user_id) FILTER (WHERE streaks.current_streak > 1) AS usuarios_com_streak,
        COALESCE(AVG(streaks.current_streak), 0) AS media_streaks
      FROM users
      LEFT JOIN streaks ON users.id = streaks.user_id;
    `);

    res.json(stats.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao obter métricas gerais" });
  }
};

export const getTopUsers = async (req: Request, res: Response) => {
  try {
    const topUsers = await pool.query(`
      SELECT users.email, streaks.current_streak, streaks.longest_streak
      FROM streaks
      JOIN users ON streaks.user_id = users.id
      ORDER BY streaks.current_streak DESC
      LIMIT 10;
    `);

    res.json(topUsers.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao obter ranking" });
  }
};

export const getFilteredStats = async (req: Request, res: Response) => {
  const { startDate, endDate, streakStatus } = req.query;
  let query = `
    SELECT users.email, streaks.current_streak, streaks.longest_streak, streaks.last_read
    FROM streaks
    JOIN users ON streaks.user_id = users.id
    WHERE 1=1
  `;

  const params: any[] = [];
  let index = 1;

  if (startDate && endDate) {
    query += ` AND streaks.last_read::DATE BETWEEN $${index} AND $${index + 1}`;
    params.push(startDate, endDate);
    index += 2;
  }

  if (streakStatus === "active") {
    query += ` AND streaks.current_streak > 0`;
  } else if (streakStatus === "inactive") {
    query += ` AND (streaks.current_streak = 0 OR streaks.last_read::DATE < CURRENT_DATE - INTERVAL '1 day')`;
  }

  try {
    const filteredStats = await pool.query(query, params);
    res.json(filteredStats.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao filtrar dados" });
  }
};
