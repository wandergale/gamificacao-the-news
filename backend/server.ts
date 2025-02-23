import express from "express";
import dotenv from "dotenv";
import routes from "./routes/Router";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);
app.use(express.json());

app.use(routes);

app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));

export default app; // tests
