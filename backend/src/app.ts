// Main application setup and configuration
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
// import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth";
import walletRoutes from "./routes/wallets";
import transactionRoutes from "./routes/transactions";
import serviceRoutes from "./routes/services";
import adminRoutes from "./routes/admin";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/admin", adminRoutes);

// Error handling
// app.use(errorHandler);

export default app;
