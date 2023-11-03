import __dirname from '../utils.js';
import productsModel from '../dao/models/products.models.js';
import userModel from '../dao/models/users.models.js';
import messageModel from '../dao/models/messege.model.js'


const mainController = {
    main: async(req, res)=>{
        const products = await productsModel.find({}).lean().limit(6).exec()
        console.log("OK")
        res.render('home', {products})
      },
      chat: async (req, res) => {
        const user = req.body.user;
        const message = req.body.message;    
        try {    
            const newMessage = new messageModel({
                user: user,
                message: message,
            });
            await newMessage.save();
            res.redirect('/chat');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al guardar el mensaje');
        }
      },
      getLogin:(req, res)=>{
        res.render('login')
      },
      getRegister: (req, res)=>{
        res.render('register')
      },
      login: async(req, res)=>{
       const {email, password} =req.body;
       const user = await userModel.findeOne({email, password})
       if(!user){  res.redirect('/login')        }
       req.session.user=user
       res.redirect('/perfil')
      },
      register: async(req, res)=>{
        const user =req.body
        await userModel.create(urer)
        res.redirect('/login')
      },
      perfil: async(req, res)=>{
      //   if(req.session?.user){
      //     return res.redirect('/perfil')
      //  }else{
      //     return res.redirect('/login')
      //  }
        res.render('perfil')
      },
}

export default mainController;