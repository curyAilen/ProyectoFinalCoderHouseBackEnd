import express from 'express';
import cartController from "../controllers/cartController.js";
const router = express.Router();

router.post('/add/:pId', cartController.addToCart);
router.delete('/remove/:pId', cartController.removeFromCart);
router.put('/update/:pId', cartController.updateCartItem);
router.get('/getCart', cartController.getCart);

export default router;