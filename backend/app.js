import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import transactionsRouter from "./routes/transactions.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (req, res) => {
  res.json({
    message: "Expense Tracker API is running",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/transactions", transactionsRouter);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
});

// Express 5 forwards errors thrown in async handlers here.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Request body is not valid JSON." });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body is too large." });
  }
  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(400).json({ message: err.message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: "That record already exists." });
  }

  console.error(err);
  res.status(err.status || 500).json({
    message: err.status ? err.message : "Something went wrong on the server. Please try again.",
  });
});

export default app;
