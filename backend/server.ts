import express from "express";
import dotenv from "dotenv";
import routes from "./routes/Router";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(
  cors({
    origin: [
      "https://the-news-bice.vercel.app/",
      "https://the-news-2a20.onrender.com",
    ],
  })
);
app.use(express.json());

app.use(routes);

app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
