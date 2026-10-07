import jwt from "jsonwebtoken";
import User from "../models/User.js";

const TOKEN_TTL = "7d";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const err = new Error("JWT_SECRET is not set on the server");
    err.status = 500;
    throw err;
  }
  return secret;
}

export function signToken(userId) {
  return jwt.sign({ sub: String(userId) }, getSecret(), { expiresIn: TOKEN_TTL });
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Please sign in to continue." });
  }

  let payload;
  try {
    payload = jwt.verify(token, getSecret());
  } catch (err) {
    if (err.status === 500) throw err;
    const message =
      err.name === "TokenExpiredError"
        ? "Your session has expired. Please sign in again."
        : "Invalid session. Please sign in again.";
    return res.status(401).json({ message });
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    return res.status(401).json({ message: "Account not found. Please sign in again." });
  }

  req.user = user;
  next();
}
