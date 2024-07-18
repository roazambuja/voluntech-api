import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import databaseConnection from "./database/connection";
import router from "./routes/auth";

dotenv.config();

databaseConnection();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
