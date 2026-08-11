import { Router } from "express";
import { productController } from "../controllers/product.controller";
import authMiddleware from "../middleware/authMiddleware";
import checkRoleMiddleware from "../middleware/checkRoleMiddleware";

const router = Router();

// Public
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

// Seller only
router.post(
  "/",
  authMiddleware,
  checkRoleMiddleware("seller"),
  productController.createProduct,
);

router.patch(
  "/:id",
  authMiddleware,
  checkRoleMiddleware("seller"),
  productController.updateProduct,
);

router.delete(
  "/:id",
  authMiddleware,
  checkRoleMiddleware("seller"),
  productController.deleteProduct,
);

router.patch(
  "/:id/restore",
  authMiddleware,
  checkRoleMiddleware("seller"),
  productController.restoreProduct,
);

export default router;