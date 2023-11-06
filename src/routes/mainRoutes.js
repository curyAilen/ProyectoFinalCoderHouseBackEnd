import express from "express";
const router = express.Router();
import mainController from "../controllers/mainController.js";


router.get('/', mainController.main);
router.get('/chat', (req, res) => {
    res.render('chat');
});
router.post('/enviar-mensaje', mainController.chat);
export default router;