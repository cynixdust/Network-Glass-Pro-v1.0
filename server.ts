import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Mock Data for initial dashboard
  app.get("/api/dashboard/stats", (req, res) => {
    res.json({
      totalDevices: 156,
      up: 142,
      down: 4,
      warning: 8,
      critical: 2,
      avgResponseTime: "12ms"
    });
  });

  app.get("/api/devices", (req, res) => {
    res.json([
      { id: "1", hostname: "core-switch-01", ipAddress: "10.0.0.1", type: "SWITCH", status: "UP", lastSeen: new Date() },
      { id: "2", hostname: "edge-router-01", ipAddress: "10.0.0.254", type: "ROUTER", status: "UP", lastSeen: new Date() },
      { id: "3", hostname: "web-srv-01", ipAddress: "192.168.1.10", type: "SERVER", status: "WARNING", lastSeen: new Date() },
      { id: "4", hostname: "db-srv-01", ipAddress: "192.168.1.20", type: "SERVER", status: "UP", lastSeen: new Date() },
      { id: "5", hostname: "backup-nas", ipAddress: "192.168.1.50", type: "SERVER", status: "DOWN", lastSeen: new Date() },
    ]);
  });

  // Socket.io connection
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      socket.emit("metric_update", {
        deviceId: "3",
        metric: "CPU",
        value: Math.floor(Math.random() * 100),
        timestamp: new Date()
      });
    }, 5000);

    socket.on("disconnect", () => {
      clearInterval(interval);
      console.log("Client disconnected");
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(console.error);
