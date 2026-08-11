import { Router } from "express";
import productController from "../controllers/product.controller";
import authMiddleware from "../middlewares/authMiddleware";
import checkRoleMiddleware from "../middlewares/checkRoleMiddleware";

const router = Router();

// Public routes
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Seller-only routes
router.post("/", authMiddleware, checkRoleMiddleware("seller"), productController.createProduct);
router.patch("/:id", authMiddleware, checkRoleMiddleware("seller"), productController.updateProduct);
router.delete("/:id", authMiddleware, checkRoleMiddleware("seller"), productController.deleteProduct);

export default router;
