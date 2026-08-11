import { Router } from "express";
import { orderController } from "../controllers/order.controller";
import authMiddleware from "../middleware/authMiddleware";
import checkRoleMiddleware from "../middleware/checkRoleMiddleware";

const router = Router();

// Authenticated users
router.post(
  "/",
  authMiddleware,
  checkRoleMiddleware("customer"),
  orderController.createOrder,
);

// Seller can manage orders
router.get(
  "/",
  authMiddleware,
  checkRoleMiddleware("seller"),
  orderController.getOrders,
);

router.get(
  "/:id",
  authMiddleware,
  checkRoleMiddleware("seller"),
  orderController.getOrderById,
);

router.patch(
  "/:id/status",
  authMiddleware,
  checkRoleMiddleware("seller"),
  orderController.updateOrderStatus,
);

router.delete(
  "/:id",
  authMiddleware,
  checkRoleMiddleware("seller"),
  orderController.deleteOrder,
);

router.patch(
  "/:id/restore",
  authMiddleware,
  checkRoleMiddleware("seller"),
  orderController.restoreOrder,
);

export default router;