import { Request, Response } from "express";
import pool from "../config/db";

export const processWebhook = async (req: Request, res: Response) => {
  try {
    const { email, id } = req.query;

    if (!email || !id) {
      return res.status(400).json({ message: "Parâmetros inválidos" });
    }

    const client = await pool.connect();

    // 🔍 Verifica se o usuário já existe
    const userResult = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    let userId;
    if (userResult.rows.length === 0) {
      // 📌 Se o usuário não existe, cria um novo
      const newUser = await client.query(
        "INSERT INTO users (email) VALUES ($1) RETURNING id",
        [email]
      );
      userId = newUser.rows[0].id;
    } else {
      userId = userResult.rows[0].id;
    }

    // 📌 Salva a leitura no banco
    await client.query(
      "INSERT INTO reads (user_id, post_id, read_at) VALUES ($1, $2, NOW())",
      [userId, id]
    );

    // 📌 Atualiza o streak
    await client.query(
      `INSERT INTO streaks (user_id, current_streak, longest_streak, last_read)
       VALUES ($1, 1, 1, NOW())
       ON CONFLICT (user_id) DO UPDATE
       SET current_streak = CASE 
         WHEN streaks.last_read = NOW() - INTERVAL '1 day' THEN streaks.current_streak + 1
         ELSE 1
       END,
       longest_streak = GREATEST(streaks.longest_streak, streaks.current_streak),
       last_read = NOW()`,
      [userId]
    );

    client.release();
    res.status(200).json({ message: "Webhook processado com sucesso" });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};
