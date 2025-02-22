import { Request, Response } from "express";
import pool from "../config/db";

export const subscribe = async (req: Request, res: Response) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const userResult = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      // se nao existir usuario
      await pool.query(
        `INSERT INTO users (email, created_at) VALUES ($1, NOW())`,
        [email]
      );

      res.status(200).json({ message: "User created" });
    } else {
      // se ja existir
      res.status(400).json({ error: "Email already used" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const users = async (req: Request, res: Response) => {
  const usersResult = await pool.query(
    `SELECT id, email, created_at, is_admin FROM users`
  );

  const users = usersResult.rows;
  res.status(200).json({ users: users });
};

export const getStreakHistory = async (req: Request, res: Response) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User id is required" });
  }

  try {
    const history = await pool.query(
      `
      SELECT read_date, streak_value 
      FROM streak_history WHERE user_id = $1 
      ORDER BY read_date DESC`,
      [userId]
    );

    res.status(200).json({ history: history.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error on search history" });
  }
};
