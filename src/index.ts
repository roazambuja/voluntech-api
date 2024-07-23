import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import databaseConnection from "./database/connection";
import router from "./routes/routes";
import cors from "cors";

dotenv.config();

databaseConnection();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
