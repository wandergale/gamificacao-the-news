import { Request, Response } from "express";
import pool from "../config/db";

export const processWebhook = async (req: Request, res: Response) => {
  try {
    // Captura os parâmetros da query string
    const { email, id } = req.query;

    // Verifica se ambos os parâmetros estão presentes
    if (!email || !id) {
      return res
        .status(400)
        .json({ success: false, message: "Email e id são obrigatórios" });
    }

    // Salva no banco de dados, por exemplo:
    // Aqui, você pode salvar no banco de dados ou processar os dados
    console.log(`📩 Webhook recebido! E-mail: ${email}, ID: ${id}`);

    // Se quiser inserir no banco de dados, faça algo como:
    await pool.query(
      "INSERT INTO reads (user_email, post_id) VALUES ($1, $2)",
      [email, id]
    );

    return res
      .status(200)
      .json({ success: true, message: "Webhook processado" });
  } catch (error) {
    console.error("Erro no webhook:", error);
    return res.status(500).json({ success: false, message: "Erro interno" });
  }
};
