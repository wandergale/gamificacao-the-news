import { Request, Response } from "express";
import pool from "../config/db";

export const getDashboard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userResult = await pool.query("SELECT COUNT(*) FROM users");
    const totalUsers = userResult.rows[0].count;
    console.log(userResult.rows[0]);

    const readsResult = await pool.query("SELECT COUNT(*) FROM reads");
    const totalReads = readsResult.rows[0].count;

    const streakResult = await pool.query("SELECT COUNT(*) FROM streaks");
    const totalStreaks = streakResult.rows[0].count;

    res.status(200).json({
      totalUsers,
      totalReads,
      totalStreaks,
    });
  } catch (error) {
    console.error("Error on processing dashboard", error);
    res.status(500).json({ message: "Error on processing dashboard" });
  }
};
