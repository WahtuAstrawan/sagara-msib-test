import mongoose from "mongoose";
import { MONGO_URL } from "./env.js";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URL);

    console.log("=== Database connected. ===");
  } catch (error) {
    console.error(`Error connecting to database: ${error}`);
    console.log("=== Database not connected. ===");
  }
};
