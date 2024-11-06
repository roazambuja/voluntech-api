import { Server } from "socket.io";

const initializeSocket = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
    },
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

  return io;
};

export default initializeSocket;
