import express from "express";
const router = express.Router();
import userController from "../controllers/userController.js";
 

router.get('/login', userController.getLogin)
router.get('/register', userController.getRegister)
router.post('/login', userController.login)
router.post('/register', userController.register)
router.get('/dashboard',  userController.dashboard)
router.get('/logout', userController.logout)

export default router;