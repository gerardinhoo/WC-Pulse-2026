import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 5050;
export const JWT_SECRET = process.env.JWT_SECRET;
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}
