import { Request, Response } from "express";
import pool from "../config/db";
import jwt from "jsonwebtoken";
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

    console.log(`Link de login enviado: https://the-news-bice.vercel.app/login?token=${token}`)
    res.json({message: "Email send"})
  } catch (error) {
    console.error(error)
    res.status(500).json({error: "Error on send link login"})
  }
};
