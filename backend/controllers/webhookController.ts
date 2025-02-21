import { Request, Response } from "express";
import pool from "../config/db";

export const processWebhook = async (req: Request, res: Response) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: "E-mail é obrigatório" });
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

    // atualiza o streak
    await pool.query(
      `INSERT INTO streaks (user_id, current_streak, longest_streak, last_read)
       VALUES ($1, 1, 1, NOW())
       ON CONFLICT (user_id) DO UPDATE
       SET current_streak = 
         CASE 
           WHEN streaks.last_read IS NULL OR streaks.last_read < NOW() - INTERVAL '1 day' 
           THEN streaks.current_streak + 1
           ELSE 1
         END,
       longest_streak = GREATEST(streaks.longest_streak, streaks.current_streak),
       last_read = NOW()`,
      [userId]
    );

    res.status(200).json({ message: "Streak uploaded" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal error" });
  }
};
