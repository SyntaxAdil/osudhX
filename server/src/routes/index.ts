import { Router } from "express";
import productRoutes from "./product.route";
import orderRoutes from "./order.route";
import categoryRoutes from "./category.route";

const router = Router();

router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/categories", categoryRoutes);

export default router;