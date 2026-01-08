import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { addToCart, clearCart, getCart, removeFromCart, updateCartItem } from '../controllers/cartController';

const router = express.Router();

router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.put("/update", protect, updateCartItem);
router.delete("/remove/:productId", protect, removeFromCart);
router.delete("/clear", protect, clearCart);

export default router;