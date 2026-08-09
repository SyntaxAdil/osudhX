import express, { type Request, type Response } from "express";
import path from "path";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());

// root
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
// docs
app.get("/docs", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "docs.html"));
});

export default app;
