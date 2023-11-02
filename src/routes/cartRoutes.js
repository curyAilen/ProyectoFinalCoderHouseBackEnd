import express from 'express';
import cartController from "../controllers/cartController.js";
const router = express.Router();

router.post('/add/:cid', cartController.addToCart);
router.post('/remove/:cid', cartController.removeFromCart);
//router.delete('/remove/:cid', cartController.removeFromCart);
router.post('/update/:cid', cartController.updateCartItem);
//router.put('/update/:cid', cartController.updateCartItem);
router.get('/getCart', cartController.getCart);

export default router;
