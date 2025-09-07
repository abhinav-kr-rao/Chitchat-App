import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import msgRouter from "./routes/msgRoutes.js";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

// intialiize socket.io server

export const io = new Server(server, {
  cors: { origin: "*" },
});

// store online users
export const userSocketMap = {}; // data of form {userId:socketId}

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected", userId);

  // add data in map (users online)
  if (userId) userSocketMap[userId] = socket.id;

  // emit online users to all connected clients

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected ", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Routes setup
app.use("/api/status", (req, res) => res.send("Server is live"));

app.use("/api/auth", userRouter);

app.use("/api/messages", msgRouter);

// connect to MongoDB
await connectDB();

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log("Server is running on port: " + port);
});
