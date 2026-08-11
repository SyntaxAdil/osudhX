import type { Request, Response, NextFunction } from "express";

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

const asyncHandler = (fn: AsyncFunction) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await fn(req, res, next);
    } catch (error) {
      const statusCode =
        error instanceof Error && "statusCode" in error
          ? Number((error as { statusCode?: number }).statusCode)
          : 500;

      const message =
        error instanceof Error ? error.message : "Internal Server Error";

      res.status(statusCode || 500).json({
        success: false,
        message,
      });
    }
  };
};

export default asyncHandler;
