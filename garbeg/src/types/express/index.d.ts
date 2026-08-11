import type { JWTPayload } from "jose";

/**
 * Augments Express's Request type with the decoded better-auth JWT
 * payload attached by `authMiddleware`. Keeping this centralized means
 * every controller gets `req.user` typed without casting to `any`.
 */
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload & {
        role?: "customer" | "seller";
      };
    }
  }
}

export {};
