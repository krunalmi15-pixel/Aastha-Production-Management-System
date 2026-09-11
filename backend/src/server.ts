import dns from "dns";

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);

import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(__dirname, "../.env")
});

import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import connectDB from "./config/database";

import employeeRoutes from "./routes/employeeRoutes";
import attendanceRoutes from "./routes/attendanceRoutes";
import machineRoutes from "./routes/machineRoutes";
import itemRoutes from "./routes/itemRoutes";
import lotRoutes from "./routes/lotRoutes";
import productionRoutes from "./routes/productionRoutes";
import summaryRoutes from "./routes/summaryRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import reportRoutes from "./routes/reportRoutes";
import settingsRoutes from "./routes/settingsRoutes";

const app = express();

// Connect MongoDB
connectDB();

// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend-url.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use(
  "/api/employees",
  employeeRoutes
);

app.use(
  "/api/attendance",
  attendanceRoutes
);

app.use(
  "/api/machines",
  machineRoutes
);

app.use(
  "/api/items",
  itemRoutes
);

app.use(
  "/api/lots",
  lotRoutes
);

app.use(
  "/api/productions",
  productionRoutes
);

app.use(
  "/api/summary",
  summaryRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/reports",
  reportRoutes
);

app.use(
  "/api/settings",
  settingsRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

// Test Route
app.get("/", (req, res) => {
  res.send(
    "Aastha Backend Running"
  );
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(
        `🚀 Server running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Server startup failed",
      error
    );
    process.exit(1);
  }
};

startServer();