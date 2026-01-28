import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  BCRYPT_SALT_ROUNDS: number;
}

const loadEnvVariables = (): EnvConfig => {
  if (process.env.NODE_ENV !== "production") {
    const requiredEnvVariables: string[] = [
      "MONGODB_URI",
      "JWT_SECRET",
      "JWT_EXPIRES_IN",
      "BCRYPT_SALT_ROUNDS",
      "PORT",
      "NODE_ENV",
    ];

    requiredEnvVariables.forEach((key) => {
      if (!process.env[key]) {
        console.warn(`Warning: Missing environment variable: ${key}`);
      }
    });
  }

  return {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: parseInt(process.env.PORT || "5000", 10),
    MONGODB_URI: process.env.MONGODB_URI || "",
    JWT_SECRET: process.env.JWT_SECRET || "fallback-secret-change-in-production",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
    BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10),
  };
};

export const envVars = loadEnvVariables();
