import { Router } from "express";
import categoryController from "../controllers/category.controller";
import authMiddleware from "../middlewares/authMiddleware";
import checkRoleMiddleware from "../middlewares/checkRoleMiddleware";

const router = Router();

// Public routes
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);

// Seller-only routes
router.post("/", authMiddleware, checkRoleMiddleware("seller"), categoryController.createCategory);
router.patch("/:id", authMiddleware, checkRoleMiddleware("seller"), categoryController.updateCategory);
router.delete("/:id", authMiddleware, checkRoleMiddleware("seller"), categoryController.deleteCategory);

export default router;
