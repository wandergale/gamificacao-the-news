import { Request, Response } from "express";
import pool from "../config/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const sendLoginLink = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "email is required" });

  try {
    let user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      user = await pool.query(
        "INSERT INTO users (email) VALUES ($1) RETURNING *",
        [email]
      );
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined on .env file");
    }
    const token = jwt.sign({ userId: user.rows[0].id }, secret, {
      expiresIn: "15m",
    });

    console.log(
      `Link de login enviado: https://the-news-bice.vercel.app/login?token=${token}`
    );
    res.json({ message: "Email send", token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error on send link login" });
  }
};

export const auth = async (req: Request, res: Response) => {
  const token = req.query.token as string;

  if (!token) return res.status(400).json({ error: "Token is required" });

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined on .env file");
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    const user = await pool.query("SELEC * FROM users WHERE id = $1", [
      decoded.userId,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: user.rows[0] });
  } catch (error) {
    res.status(401).json({ error: "invalid token or expired" });
  }
};

export const streak = async (req: Request, res: Response) => {
  const { userId } = req.query;

  if (!userId) return res.status(400).json({ error: "user id required" });

  try {
    const result = await pool.query(
      `SELECT current_streak, longest_streak, last_read
        FROM streaks
        WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({
        current_streak: 0,
        longest_streak: 0,
        last_read: null,
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error on search streak" });
  }
};
