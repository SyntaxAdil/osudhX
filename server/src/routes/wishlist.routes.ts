import { Router } from "express";
import wishlistController from "../controllers/wishlist.controller";
import authMiddleware from "../middleware/authMiddleware";
import checkRoleMiddleware from "../middleware/checkRoleMiddleware";

const router = Router();

// All wishlist routes require authentication and are customer-only.
router.use(authMiddleware, checkRoleMiddleware("customer"));

router.post("/", wishlistController.addToWishlist);
router.get("/", wishlistController.getWishlist);
router.get("/:id", wishlistController.getWishlistById);
router.delete("/:id", wishlistController.removeFromWishlist);

export default router;
