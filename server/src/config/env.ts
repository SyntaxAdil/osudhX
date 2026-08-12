import dotenv from "dotenv";

dotenv.config();

const port = Number(process.env.PORT) || 5000;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

const clientUrl =
  process.env.PUBLIC_CLIENT_URL || "http://localhost:3000";

const betterAuthUrl =
  process.env.BETTER_AUTH_URL || "http://localhost:5000";

export default {
  port,
  databaseUrl,
  clientUrl,
  betterAuthUrl,
  googleClientId: process.env.GOOGLE_CLIENT_ID!,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
};