import { Router } from "express";
import Transaction from "../models/Transaction.js";

const router = Router();

// GET /api/transactions — list all, newest first
router.get("/", async (req, res) => {
  const transactions = await Transaction.find().sort({ createdAt: -1 });
  res.json(transactions);
});

// POST /api/transactions — create one
router.post("/", async (req, res) => {
  const { description, amount, category } = req.body;

  if (!description || amount === undefined) {
    return res.status(400).json({ message: "description and amount are required" });
  }

  const transaction = await Transaction.create({ description, amount, category });
  res.status(201).json(transaction);
});

// PUT /api/transactions/:id — update one
router.put("/:id", async (req, res) => {
  const { description, amount, category } = req.body;

  const transaction = await Transaction.findByIdAndUpdate(
    req.params.id,
    { description, amount, category },
    { new: true, runValidators: true }
  );

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  res.json(transaction);
});

// DELETE /api/transactions/:id — delete one
router.delete("/:id", async (req, res) => {
  const transaction = await Transaction.findByIdAndDelete(req.params.id);

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  res.json({ message: "Transaction deleted" });
});

export default router;
