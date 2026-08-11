import { Router } from "express";
import { categoryController } from "../controllers/category.controller";
import authMiddleware from "../middleware/authMiddleware";
import checkRoleMiddleware from "../middleware/checkRoleMiddleware";

const router = Router();

// Public
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);

// Seller only
router.post(
  "/",
  authMiddleware,
  checkRoleMiddleware("seller"),
  categoryController.createCategory,
);

router.patch(
  "/:id",
  authMiddleware,
  checkRoleMiddleware("seller"),
  categoryController.updateCategory,
);

router.delete(
  "/:id",
  authMiddleware,
  checkRoleMiddleware("seller"),
  categoryController.deleteCategory,
);

router.patch(
  "/:id/restore",
  authMiddleware,
  checkRoleMiddleware("seller"),
  categoryController.restoreCategory,
);

export default router;
