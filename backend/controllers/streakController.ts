import { Request, Response } from "express";
import pool from "../config/db";

interface IStreakRequest extends Request {
  body: {
    email: string;
    current_streak: number;
  };
}

export const updateStreak = async (
  req: IStreakRequest,
  res: Response
): Promise<any> => {
  try {
    const { email, current_streak } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (typeof current_streak !== "number") {
      return res.status(400).json({ message: "Current streak is required" });
    }

    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const userId = userResult.rows[0].id;

    const streakResult = await pool.query(
      "SELECT * FROM streaks WHERE user_id = $1",
      [userId]
    );

    if (streakResult.rows.length > 0) {
      await pool.query(
        "UPDATE streaks SET current_streak = $1 WHERE user_id = $2",
        [current_streak, userId]
      );
    } else {
      await pool.query(
        "INSERT INTO streaks (user_is, current_streak) VALUES ($1, $2)",
        [userId, current_streak]
      );
    }

    return res.status(200).json({ message: "Streaks updated" });
  } catch (error) {
    console.error("Error updating", error);
    return res.status(500).json({ message: "Error updating" });
  }
};
