// const app = require("./app");
// const { createServer } = require("http");
const { Server } = require("socket.io");
const { CORS_ALLOW_ORIGINS } = require("./src/Config/index.config");
const {
  admin_receiver_listeners,
  student_receiver_listeners,
} = require("./src/Constants/socket.constants");

let ioInstance = null;

function initializeSocketServer(httpServer) {
  // const serverHttp = createServer(app);
  ioInstance = new Server(httpServer, { cors: CORS_ALLOW_ORIGINS });
  ioInstance.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Admin joins their room
    socket.on(admin_receiver_listeners.join_admin_room, (adminId) => {
      socket.join(adminId);
      console.log(`Admin ${adminId} joined room`);
    });

    socket.on(student_receiver_listeners.join_student_room, (studentId) => {
      socket.join(studentId);
      console.log(`Student ${studentId} joined room`);
    });

    // Client disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
  // return serverHttp;
}

const getSocketIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.IO is not initialized.");
  }
  return ioInstance;
};

module.exports = {
  initializeSocketServer,
  getSocketIO,
};
