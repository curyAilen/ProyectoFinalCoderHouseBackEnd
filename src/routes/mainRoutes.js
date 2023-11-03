import express from "express";
const router = express.Router();
import mainController from "../controllers/mainController.js";


router.get('/', mainController.main, mainController.totalQuantity);
router.get('/perfil', mainController.perfil);
router.get('/login', mainController.getLogin);
router.get('/register', mainController.getRegister);
router.post('/login', mainController.login);
router.post('/register', mainController.register);



router.get('/chat', (req, res) => {
    res.render('chat');
});
router.post('/enviar-mensaje', mainController.chat);
export default router;