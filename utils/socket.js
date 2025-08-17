let io;

const initSocket = (server) => {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: {
      origin: "https://medikartt.netlify.app",
      methods: ["GET", "POST"]
    },
  });

  io.on("connection", (socket) => {
    console.log("🔗 Admin/Client connected:", socket.id);
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = { initSocket, getIO };
