import {__dirname} from '../utils.js';
import productsModel from '../dao/models/products.models.js';
//import userModel from '../dao/models/users.models.js';
import messageModel from '../dao/models/messege.model.js'



const mainController = {
    main: async(req, res)=>{
      const eigthProducts = 8;
      const products = await productsModel.find({}).sort({ createdAt: -1 }).limit(eigthProducts).lean().exec()
      const totalQuantity = 0;
      const user = req.session.user
      if(!user){
        console.log("No hay usuario logueado")              
      }else{
        console.log(user)
      }
        res.render('home', { totalQuantity, user, products })
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
      error: (req, res)=>{
        const titulo = "Lo sentimos, ha ocurrido un error.";
        const mensaje= "Por favor, intenta nuevamente o contacta al soporte."
        res.render('error', {titulo, mensaje})
      }
     
      
}

export default mainController;