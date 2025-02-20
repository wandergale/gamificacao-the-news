import express from "express";
import dotenv from "dotenv";
import routes from "./routes/Router";

dotenv.config();

// const PORT = process.env.PORT;

const app = express();
app.use(express.json());

app.use(routes);

// app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
