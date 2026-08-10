import dotenv from "dotenv";

dotenv.config();

const port = Number(process.env.PORT) || 5000;
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

export default {
  port,
  databaseUrl,
};