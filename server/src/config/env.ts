import dotenv from "dotenv";

dotenv.config();

const port = Number(process.env.PORT) || 5000;
const serverUrl = process.env.SERVER_URL || `http://localhost:${port}`;

export default {
  port,
  serverUrl,
};