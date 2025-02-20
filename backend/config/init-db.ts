import pool from "./db";

const createTables = async () => {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS reads (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        post_id TEXT NOT NULL,
        read_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS streaks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
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
    `);

    console.log("Tabelas criadas com sucesso!");
  } catch (error) {
    console.error("Erro ao criar tabelas:", error);
  } finally {
    client.release();
  }
};

createTables();
