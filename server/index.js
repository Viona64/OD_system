import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Route modules
import authRoutes from "./routes/auth.js";
import departmentRoutes from "./routes/departments.js";
import studentRoutes from "./routes/students.js";
import applicationRoutes from "./routes/applications.js";
import policyRoutes from "./routes/policies.js";
import notificationRoutes from "./routes/notifications.js";

// Load configurations
dotenv.config();

// Connect database
connectDB();

const app = express();

// Standard middlewares
app.use(cors());
app.use(express.json());

// Bind API route paths
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/notifications", notificationRoutes);

// Server status endpoint
app.get("/health", (req, res) => {
  return res.json({
    status: "ok",
    message: "Student Leave Management Dashboard backend is running smoothly.",
  });
});

// Centralized error handler middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  return res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
