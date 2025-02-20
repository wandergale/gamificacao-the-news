import { Request, Response } from "express";
import pool from "../config/db";

export const processWebhook = async (req: Request, res: Response) => {
  try {
    const { email, id, utm_source, utm_medium, utm_campaign, utm_channel } =
      req.body;

    let user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      user = await pool.query(
        "INSERT INTO users (email) VALUES ($1) RETURNING *",
        [email]
      );
    }
    const userId = user.rows[0].id;

    await pool.query("INSERT INTO reads (user_id, post_id) VALUES ($1, $2)", [
      userId,
      id,
    ]);

    await pool.query(
      `INSERT INTO streaks (user_id, current_streak, longest_streak, last_read)
        VALUES ($1, 1, 1, NOW())
        ON CONFLICT (user_id) DO UPDATE
        SET 
            current_streak = CASE 
                WHEN streaks.last_read IS NULL OR streaks.last_read < NOW() - INTERVAL '2 days' THEN 1
                ELSE streaks.current_streak + 1
            END,
            longest_streak = GREATEST(streaks.longest_streak, streaks.current_streak + 1),
            last_read = NOW()
        RETURNING *`,
      [userId]
    );

    if (utm_source || utm_medium || utm_campaign || utm_channel) {
      await pool.query(
        `INSERT INTO utm_data (user_id, utm_source, utm_medium, utm_campaign, utm_channel)
                            VALUES ($1, $2, $3, $4, $5)`,
        [userId, utm_source, utm_medium, utm_campaign, utm_channel]
      );
    }

    res.status(200).json({ message: "Webhook processed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const webhookHandler = async (req: Request, res: Response) => {
  try {
    const { email, id } = req.query;

    if (!email || !id) {
      return res.status(400).json({ message: "email and id required" });
    }

    console.log(`received: Email = ${email}`);

    let user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      user = await pool.query(
        "INSERT INTO users (email) VALUES ($1) RETURNING *",
        [email]
      );
    }

    const userId = user.rows[0].id;

    await pool.query("INSERT INTO reads (user_id, post_id) VALUES ($1, $2)", [
      userId,
      id,
    ]);

    await pool.query(
      `INSERT INTO streaks (user_id, current_streak, longest_streak, last_read)
        VALUES ($1, 1, 1, NOW())
        ON CONFLICT (user_id) DO UPDATE
        SET 
            current_streak = CASE 
                WHEN streaks.last_read IS NULL OR streaks.last_read < NOW() - INTERVAL '2 days' THEN 1
                ELSE streaks.current_streak + 1
            END,
            longest_streak = GREATEST(streaks.longest_streak, streaks.current_streak + 1),
            last_read = NOW()
        RETURNING *`,
      [userId]
    );

    return res.status(200).json({ success: true, email: email });
  } catch (error) {
    console.error("webhook error:", error);
    return res.status(500).json({ message: "Internal error" });
  }
};
