import express from "express";
import cors from "cors";
import dotenv from "dotenv";

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


dotenv.config();



// Connect MongoDB

connectDB();





const app = express();




// Middlewares

app.use(cors());

app.use(express.json());
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
app.use("/api/lots", lotRoutes);
app.use("/api/productions", productionRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/auth", authRoutes);






// Test Route

app.get("/", (req, res) => {


  res.send(
    "Aastha Backend Running"
  );


});






const PORT = process.env.PORT || 5000;





app.listen(PORT, () => {


  console.log(
    `Server running on port ${PORT}`
  );


});