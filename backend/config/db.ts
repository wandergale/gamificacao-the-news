import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const createTables = async () => {
  const client = await pool.connect();

  try {
    console.log("Verificando/criando tabelas no banco...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS reads (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        post_id TEXT NOT NULL,
        read_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS streaks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        last_read TIMESTAMP
      );  

      CREATE TABLE IF NOT EXISTS utm_data (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        utm_source TEXT,
        utm_medium TEXT,
        utm_campaign TEXT,
        utm_channel TEXT
      );
    
      DROP VIEW IF EXISTS engagement_metrics;
      CREATE VIEW engagement_metrics AS
      SELECT 
        COUNT(DISTINCT user_id) AS total_usuarios_ativos,
        AVG(current_streak) AS media_streaks,
        COUNT(*) FILTER (WHERE current_streak > 1) AS usuarios_com_streak
      FROM streaks;
    `);
    console.log("View engagement_metrics verificada/criada.");

    console.log("Tabelas criadas/verificadas com sucesso!");
  } catch (error) {
    console.error("Erro ao criar tabelas:", error);
  } finally {
    client.release();
  }
};

createTables();

export default pool;
