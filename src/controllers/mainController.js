import __dirname from '../utils.js';
import productsModel from '../dao/models/products.models.js';
import userModel from '../dao/models/users.models.js';
import messageModel from '../dao/models/messege.model.js'



const mainController = {
    main: async(req, res)=>{
      const totalQuantity = 0;
      const user = req.session.user
      console.log(user)      
        res.render('home', {totalQuantity, user})
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
     
      
}

export default mainController;