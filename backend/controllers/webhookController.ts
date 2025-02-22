import { Request, Response } from "express";
import pool from "../config/db";

export const processWebhook = async (req: Request, res: Response) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }

  try {
    // busca o user_id pelo e-mail
    const userResult = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const userId = userResult.rows[0].id;

    const streakResult = await pool.query(
      `
      SELECT current_streak, longest_streak, last_read FROM streaks WHERE user_id = $1`,
      [userId]
    );

    let newStreak = 1;
    let newLongestStreak = 1;
    let lastRead = null;

    if (streakResult.rows.length > 0) {
      const { current_streak, longest_streak, last_read } =
        streakResult.rows[0];
      lastRead = new Date(last_read);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (lastRead?.toDateString() === yesterday.toDateString()) {
        newStreak = current_streak + 1;
      } else if (lastRead.getDay() === 6 && today.getDay() === 1) {
        newStreak = current_streak + 1;
      } else if (lastRead.toDateString() === today.toDateString()) {
        return res.status(200).json({ message: "Streak already updated" });
      } else {
        newStreak = 1;
      }

      newLongestStreak = Math.max(longest_streak, newStreak);
    }

    // atualiza o streak
    await pool.query(
      `INSERT INTO streaks (user_id, current_streak, longest_streak, last_read)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id) DO UPDATE
       SET current_streak = $2,
           longest_streak = $3,
           last_read = NOW()`,
      [userId, newStreak, newLongestStreak]
    );

    res
      .status(200)
      .json({ message: "Streak uploaded", newStreak, newLongestStreak });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal error" });
  }
};
