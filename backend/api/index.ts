import mongoose from "mongoose";

import app from "../src/app";
import { envVars } from "../src/app/config/env";

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }
  
  try {
    await mongoose.connect(envVars.MONGODB_URI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

connectDB();

export default app;
