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
  const users = await pool.query(
    `SELECT id, email, created_at, is_admin FROM users`
  );

  res.status(200).json({ users });
};
