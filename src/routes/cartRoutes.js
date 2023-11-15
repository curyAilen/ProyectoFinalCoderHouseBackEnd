import express from 'express';
import cartController from "../controllers/cartController.js";
import { Router } from "express";
const router = Router()

 
router.post('/add/:cid/products/:pid', cartController.addToCart);
router.delete('/:cid/remove/:pid', cartController.remove);
router.post('/clear/:cid', cartController.clearCart);


export default router;
