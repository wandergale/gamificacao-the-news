# Case - Gamificação the news

## instruções para rodar projeto
Deploy do projeto - (https://the-news-bice.vercel.app/) -- (https://the-news-2a20.onrender.com) <br />
Webhook: https://the-news-2a20.onrender.com/webhook?email=wandersongamer2@gmail.com

</br>
> BACKEND <br/ >
* Criar um banco de dados postgreSQL e rodar o SQL:

```
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          is_admin BOOLEAN DEFAULT FALSE
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
      CREATE TABLE IF NOT EXISTS streak_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        read_date DATE NOT NULL,
        streak_value INTEGER NOT NULL,
        UNIQUE(user_id, read_date)
      );
      UPDATE users SET is_admin = TRUE WHERE email = 'wanderAdmin@gmail.com';
```

Se for rodar localmente precisa alterar o arquivo `config/db.ts`
```
  import { Pool } from "pg";
  import dotenv from "dotenv"; 

  dotenv.config();

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  export default pool;
```
So isso é o suficiente pra rodar.
<br/>
agora criar o arquivo .env com: 
`DATABASE_URL`, `PORT`, `JWT_SECRET` e `FRONTEND_URL` <br />
 e agora é so instalar as dependencias `npm i` e rodar o backend com `npm run start` <br />
<br/>
FRONTEND <br />
Criar um arquivo .env e colocar `REACT_APP_API_URL` ou colocar diretamente o link da api<br />
Agora so dar o `npm i` e rodar o projeto `npm run start`
