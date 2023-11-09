import express from "express";
const router = express.Router();
import userController from "../controllers/userController.js";
import productController from "../controllers/productsController.js";
import cartController from "../controllers/cartController.js";
 
function auth(req, res, next) {
    if(req.session?.user) return next()
    else{
        res.redirect('/')
    }  
}

//USER
router.get('/user/login',  userController.getLogin)
router.get('/user/dashboard', auth,  userController.dashboard)
router.get('/user/logout',  userController.logout)

//PRODUCTS
router.get('/products',  productController.list);
router.get('/products/detail/:pid',  productController.detailProduct);
router.get('/products/create',  productController.create);

//CART
router.get('/cart/getCart/:cid', cartController.getCart);
export default router;