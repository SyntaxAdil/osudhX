import express, { type Request, type Response } from "express";
import path from "path";
import cors from "cors";
import { connectDatabase } from "./config/db";
import env from "./config/env";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import router from "./routes";

const app = express();
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

connectDatabase();

app.use("/api", router);

app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

app.get("/docs", (_req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), "public", "docs.html"));
});

export default app;