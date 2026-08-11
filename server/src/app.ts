import express, { type Request, type Response } from "express";
import path from "path";
import cors from "cors";
import { connectDatabase } from "./config/db";
import env from "./config/env";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
const app = express();
app.use(cors());

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true, 
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth)); 
app.use(express.json());

connectDatabase();

// root
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
// docs
app.get("/docs", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "docs.html"));
});

export default app;
