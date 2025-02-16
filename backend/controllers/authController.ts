import { Request, Response } from "express";
import pool from "../config/db";

interface LoginRequest extends Request {
  query: {
    email: string;
  };
}

export const login = async (req: LoginRequest, res: Response): Promise<any> => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const userResult = await pool.query(
      `SELECT * FROM users WHERE email = $1`, [email]
    );
    if (userResult.rows.length == 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];

    const streakResult = await pool.query(
      `SELECT * FROM streaks WHERE user_id = $1`, [user.id]
    );
    const streak =
      streakResult.rows.length > 0
        ? streakResult.rows[0]
        : { current_streak: 0 };

    const readsResult = await pool.query(
      `SELECT * FROM reads WHERE user_id = $1 ORDER BY opened_at DESC`, [user.id]
    );

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
      },
      streak: streak.current_streak,
      reads: readsResult.rows,
    });
  } catch (error) {
    console.error("Login error: ", error);
    res.status(500).json({ message: "Login error" });
  }
};
