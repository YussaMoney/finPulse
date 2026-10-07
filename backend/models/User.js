import mongoose from "mongoose";
import { SUPPORTED_CURRENCIES } from "../utils/currency.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    currency: {
      type: String,
      enum: SUPPORTED_CURRENCIES,
      default: "₦",
    },
  },
  { timestamps: true }
);

userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    currency: this.currency,
  };
};

const User = mongoose.model("User", userSchema);

export default User;
