import mongoose from "mongoose";
import "@/models/Product";
import "@/models/User";
import "@/models/Category";
import "@/models/Order";
import "@/models/Cart";

let isConnected = false;

export async function dbConnect() {
  if (isConnected) return;

  const mongoUri =
    process.env.NODE_ENV === "production"
      ? process.env.MONGODB_URI_PROD
      : process.env.MONGODB_URI_DEV;

  if (!mongoUri) {
    throw new Error(
      "MONGODB_URI is not defined in the environment variables for the current environment"
    );
  }

  try {
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log(`Connected to MongoDB (${mongoUri} database)`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}
