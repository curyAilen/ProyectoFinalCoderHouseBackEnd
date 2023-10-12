import express from "express";
const router = express.Router();
import mainController from "../controllers/mainController.js";


router.get('/', mainController.main);

export default router;