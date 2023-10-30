import express from 'express';
import cartController from "../controllers/cartController.js";
const router = express.Router();

router.post('/add/:cid', cartController.addToCart);
router.delete('/remove/:cid', cartController.removeFromCart);
router.put('/update/:cid', cartController.updateCartItem);
router.get('/getCart', cartController.getCart);

export default router;
