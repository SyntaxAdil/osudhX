import type { Request, Response, NextFunction } from "express";

const checkRoleMiddleware = (roles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(req.user.role as string)) {
      res.status(403).json({
        success: false,
        message: "Forbidden - Insufficient permissions",
      });
      return;
    }

    next();
  };
};

export default checkRoleMiddleware;