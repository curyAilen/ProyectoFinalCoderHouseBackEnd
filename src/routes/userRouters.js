import { Router } from 'express'
import userController from "../controllers/userController.js";
import passport from 'passport';


const router = Router()


router.get('/register', userController.getRegister)
// router.post('/login', userController.login)
// router.post('/register', userController.register)
router.post('/login', userController.loginToken)
router.post('/register', userController.registerToken)

router.get('/login-github', passport.authenticate('github', {scope: ['user:email']}),
    async (req, res) => {}
)
router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/'}),
    async(req, res) => {
        console.log('Callback: ', req.user)
        req.session.user = req.user

        console.log(req.session)
        res.redirect('/')
    }
)



export default router;