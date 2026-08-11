import { Router } from "express";
import orderController from "../controllers/order.controller";
import authMiddleware from "../middlewares/authMiddleware";
import checkRoleMiddleware from "../middlewares/checkRoleMiddleware";

const router = Router();

// All order routes require authentication.
router.use(authMiddleware);

router.post("/", checkRoleMiddleware("customer"), orderController.createOrder);
router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.patch("/:id/status", checkRoleMiddleware("seller"), orderController.updateOrderStatus);
router.patch("/:id/cancel", checkRoleMiddleware("customer"), orderController.cancelOrder);

export default router;
