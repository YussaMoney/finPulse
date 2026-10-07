import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import transactionsRouter from "./routes/transactions.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    message: "Expense Tracker API is running",
  });
});

app.use("/api/transactions", transactionsRouter);

export default app;
