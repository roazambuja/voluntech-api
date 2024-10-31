import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import databaseConnection from "./database/connection";
import router from "./routes/routes";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

databaseConnection();

const app: Express = express();
const port = process.env.PORT || 3000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.ORIGIN,
    methods: ["GET", "POST"],
  },
});

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
  res.send("Express + TypeScript Server with WebSocket");
});

io.on("connection", (socket) => {
  socket.on("sendMessage", (payload) => {
    const { from, to } = payload;
    let fromId = from._id;
    let toId = to._id;
    const roomName = [fromId, toId].sort().join("-");
    io.to(roomName).emit("newMessage", payload);
  });

  socket.on("joinRoom", (roomName) => {
    socket.join(roomName);
  });
});

httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
