import dns from "dns";
import mongoose from "mongoose";

// Some routers/ISPs don't forward the DNS SRV lookups that Atlas connection
// strings rely on. Falling back to a public resolver avoids ECONNREFUSED
// errors on those networks. Harmless in cloud environments too.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Serverless functions can reuse a "warm" instance between requests, so we
// cache the connection promise instead of calling mongoose.connect() again
// on every invocation — that would exhaust Atlas's connection limit fast.
let connectionPromise = null;

export function connectDB() {
  if (!connectionPromise) {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      connectionPromise = null;
      throw new Error("MONGODB_URI is not set");
    }

    connectionPromise = mongoose.connect(uri, { dbName: "finpulse" });
  }

  return connectionPromise;
}
