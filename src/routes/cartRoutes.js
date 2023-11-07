import express from 'express';
import cartController from "../controllers/cartController.js";
const router = express.Router();


// router.get('/getCart', cartController.getCart);
router.post('/add/:cid', cartController.addToCart);
router.post('/remove/:cid', cartController.remove);
//router.delete('/remove/:cid', cartController.remove);
//router.put('/update/:cid', cartController.updateCartItem);


export default router;
