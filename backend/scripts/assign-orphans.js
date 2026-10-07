// One-off migration: give transactions created before accounts existed to a user.
// Usage (from backend/): node scripts/assign-orphans.js you@example.com
import dotenv from "dotenv";
dotenv.config({ quiet: true });

import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error("Usage: node scripts/assign-orphans.js <account-email>");
  process.exit(1);
}

await connectDB();

const user = await User.findOne({ email });
if (!user) {
  console.error(`No account found for ${email}. Sign up in the app first.`);
  await mongoose.disconnect();
  process.exit(1);
}

const { modifiedCount } = await Transaction.updateMany(
  { user: { $exists: false } },
  { $set: { user: user._id } },
  { strict: false }
);

console.log(`Assigned ${modifiedCount} transaction(s) to ${user.name} <${user.email}>.`);
await mongoose.disconnect();
