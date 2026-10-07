import { Router } from "express";
import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import { requireAuth } from "../middleware/auth.js";
import { SUPPORTED_CURRENCIES, convertAmount } from "../utils/currency.js";
import sampleTransactions from "../utils/sampleTransactions.js";

const router = Router();

router.use(requireAuth);

function readTransactionInput(body) {
  const description = typeof body?.description === "string" ? body.description.trim() : "";
  const amount = Number(body?.amount);
  const category =
    typeof body?.category === "string" && body.category.trim() ? body.category.trim() : "Other";

  if (!description) return { error: "Description is required." };
  if (!Number.isFinite(amount) || amount === 0) {
    return { error: "Amount must be a non-zero number." };
  }

  return { value: { description, amount, category } };
}

function isValidId(id) {
  return mongoose.isValidObjectId(id);
}

// GET /api/transactions — list the signed-in user's transactions, newest first
router.get("/", async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(transactions);
});

// POST /api/transactions — create one
router.post("/", async (req, res) => {
  const { value, error } = readTransactionInput(req.body);
  if (error) return res.status(400).json({ message: error });

  const transaction = await Transaction.create({ ...value, user: req.user._id });
  res.status(201).json(transaction);
});

// DELETE /api/transactions — clear all of the user's transactions
router.delete("/", async (req, res) => {
  const { deletedCount } = await Transaction.deleteMany({ user: req.user._id });
  res.json({ message: "All transactions cleared.", deletedCount });
});

// POST /api/transactions/sample — replace the user's data with demo transactions
router.post("/sample", async (req, res) => {
  const currency = req.user.currency;
  const docs = sampleTransactions.map((t, index) => ({
    ...t,
    amount: convertAmount(t.amount, "₦", currency),
    user: req.user._id,
    createdAt: new Date(Date.now() - index * 86_400_000),
  }));

  await Transaction.deleteMany({ user: req.user._id });
  await Transaction.insertMany(docs);

  const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(201).json(transactions);
});

// POST /api/transactions/convert — convert every amount and save the new currency
router.post("/convert", async (req, res) => {
  const to = req.body?.to;
  if (!SUPPORTED_CURRENCIES.includes(to)) {
    return res.status(400).json({ message: "Unsupported currency." });
  }

  const from = req.user.currency;
  if (from !== to) {
    const transactions = await Transaction.find({ user: req.user._id });
    if (transactions.length > 0) {
      await Transaction.bulkWrite(
        transactions.map((t) => ({
          updateOne: {
            filter: { _id: t._id, user: req.user._id },
            update: { $set: { amount: convertAmount(t.amount, from, to) } },
          },
        }))
      );
    }
    req.user.currency = to;
    await req.user.save();
  }

  const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ user: req.user.toPublicJSON(), transactions });
});

// PUT /api/transactions/:id — update one
router.put("/:id", async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(404).json({ message: "Transaction not found." });
  }

  const { value, error } = readTransactionInput(req.body);
  if (error) return res.status(400).json({ message: error });

  const transaction = await Transaction.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    value,
    { new: true, runValidators: true }
  );

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found." });
  }

  res.json(transaction);
});

// DELETE /api/transactions/:id — delete one
router.delete("/:id", async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(404).json({ message: "Transaction not found." });
  }

  const transaction = await Transaction.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found." });
  }

  res.json({ message: "Transaction deleted." });
});

export default router;
