import type { Request, Response, NextFunction } from "express";
import validateToken from "./validateToken";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;


    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
      });
      return;
    }

    const payload = await validateToken(token);

    req.user = payload;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid token",
    });
  }
};

export default authMiddleware;
