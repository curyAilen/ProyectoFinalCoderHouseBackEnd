import express from 'express';
import cartController from "../controllers/cartController.js";
const router = express.Router();

router.post('/add/:productId', cartController.addToCart);
router.delete('/remove/:productId', cartController.removeFromCart);
router.put('/update/:productId', cartController.updateCartItem);
router.get('/getCart', cartController.getCart);

export default router;
