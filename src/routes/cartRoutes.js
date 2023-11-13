import express from 'express';
import cartController from "../controllers/cartController.js";
import { Router } from "express";
const router = Router()

router.post('/add/:cid/products/:pid', cartController.addToCart);
router.delete('/remove/:cid', cartController.remove);


export default router;
