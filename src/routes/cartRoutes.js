import express from 'express';
import cartController from "../controllers/cartController.js";
const router = express.Router();



router.post('/add/:cid/products/:pid', cartController.addToCart);
router.delete('/remove/:cid', cartController.remove);
//router.put('/update/:cid', cartController.updateCartItem);


export default router;
