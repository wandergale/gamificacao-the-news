import { Request, Response } from "express";
import pool from "../config/db";

export const metrics = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM engagement_metrics");
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({error: "Error on searching metrics"})
  }
};
