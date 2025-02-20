import { Request, Response } from "express";
import pool from "../config/db";

export const metrics = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM engagement_metrics");
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error on searching metrics" });
  }
};

export const topReaders = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
            SELECT u.email, s.current_streak, s.longest_streak, s.last_read
            FROM streaks s 
                JOIN users u ON u.id = s.user_id
                ORDER BY s.current_streak DESC LIMIT 10`);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error on ranking" });
  }
};
