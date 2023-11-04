import express from "express";
const router = express.Router();
import userController from "../controllers/userController.js";
 

router.get('/login', userController.getLogin)
router.get('/register', userController.getRegister)

router.post('/login', userController.login)
router.post('/register', userController.register)

/*router.get('/', (req,res)=>{
 if(req.session?.user){
    return res.redirect('user/perfil')
 }else{
    return res.redirect('user/login')
 }
});
router.get('/register', (req, res)=>{
    if(req.session?.user){
        return res.redirect('user/perfil')
     }else{
        return res.redirect('user/register')
     }
})
router.get('/perfil', auth, (req,res)=>{
 const user =req.session.user
 res.render('/perfil', user)
})
function auth(req, res, next){
    if(req.session?.user) return next()
    res.redirect('/')
}
*/
export default router;