import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

import errorMiddleware from "./middleware/errorMiddleware.js";
import socketAuthMiddleware from "./middleware/socketAuthMiddleware.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://foodnest-wheat.vercel.app",
  "https://food-nest-three.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin not allowed by CORS: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
};

const io = new Server(httpServer, {
  cors: corsOptions,
});

app.set("io", io);

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// API health check
app.get("/", (req, res) => {
  res.send("FoodNest API Running");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/ai", aiRoutes);

// Socket.IO authentication
io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  console.log("Authenticated socket connected:", socket.id);

  const userId = socket.user?.id;

  if (userId) {
    socket.join(`user:${userId}`);
    console.log(`User ${userId} joined their private room`);
  } else {
    console.error("Socket connected without a valid user ID");
    socket.disconnect(true);
    return;
  }

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Error middleware must remain last
app.use(errorMiddleware);

// Connect to MongoDB and start the server
const PORT = process.env.PORT || 5000;

try {
  await connectDB();

  httpServer.listen(PORT, () => {
    console.log(`FoodNest server running on port ${PORT}`);
    console.log("Socket.IO is ready");
  });
} catch (error) {
  console.error("Failed to connect to MongoDB:", error.message);
  process.exit(1);
}