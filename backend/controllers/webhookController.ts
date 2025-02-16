import { Request, Response } from "express";

import pool from "../config/db";

interface IWebHookRequestBody {
  email: string;
  newsletter_id: string;
  opened_at: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_channel?: string;
}

export const handleWebhook = async (
  req: Request<{}, {}, IWebHookRequestBody>,
  res: Response
): Promise<void> => {
  const {
    email,
    newsletter_id,
    opened_at,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_channel,
  } = req.body;

  try {
    console.log("EMAIL RECEBIDO: ", email);
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    if (result.rows.length === 0) {
      console.log("Usuário não encontrado");
      await pool.query(`INSERT INTO users (email) VALUES ($1)`, [email]);
    }

    await pool.query(
      `INSERT INTO reads (user_id, newsletter_id, opened_at, utm_source, utm_medium, utm_campaign, utm_channel) ` +
        `VALUES ((SELECT id FROM users WHERE email = $1), $2, $3, $4, $5, $6, $7
        )`,
      [
        email,
        newsletter_id,
        opened_at,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_channel,
      ]
    );

    const streakResult = await pool.query(
      `SELECT * FROM streaks WHERE user_id = (SELECT id FROM users WHERE email = $1)`,
      [email]
    );

    if (streakResult.rows.length > 0) {
      const lastStreakDate = streakResult.rows[0].last_streak_date;
      const currentStreak = streakResult.rows[0].current_streak;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDay() - 1);
      const yesterdayString = yesterday.toISOString().split("T")[0];

      if (lastStreakDate === yesterdayString) {
        await pool.query(
          `UPDATE streaks SET current_streak = ${
            currentStreak + 1
          } WHERE user_id = (SELECT id FROM users WHERE email = $1)`,
          [email]
        );
      } else {
        await pool.query(
          `INSERT INTO streaks (user_id, current_streak, last_streak_date) VALUES ((SELECT id FROM users WHERE email = $1), 1, $2)`,
          [email, opened_at.split("T")[0]]
        );
      }
    }
    res.status(200).json({ message: "Dados processados" });
  } catch (error) {
    console.error(`Error ao processar webhook: ${error}`);
    res.status(500).json({ message: "Erro ao processar dados" });
  }
};
