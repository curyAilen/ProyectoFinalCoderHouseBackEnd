import __dirname from '../utils.js';
import productsModel from '../dao/models/products.models.js';
import userModel from '../dao/models/users.models.js';


const userController = {
getLogin:(req, res)=>{
    res.render('login')
  },
  getRegister: (req, res)=>{
    res.render('register')
  },
  totalQuantity: async(req, res)=>{
    try{       
      if(!login){
        const totalQuantity = 0;
        console.log(totalQuantity)
        return totalQuantity
      }
      const cart =  await cartsModel.findOne({_id: '6543d89a5809bb6f30617071'});
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    //const totalQuantity = cart.products.reduce((total, product) => total + product.quantity, 0);
  console.log(totalQuantity)
          return ({ totalQuantity });
      } catch (error) {
          res.status(500).json({ status: "error", error: error.message });
      }  
  
  },
  login: async(req, res)=>{
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email });
      if (!user) {
          return res.status(401).json({ error: 'Usuario no encontrado' });
      }
      const isPasswordValid = await userModel.findOne({ password });
      if (!isPasswordValid) {
          return res.status(401).json({ error: 'Contraseña incorrecta' });
      }
      req.session.user = {
          _id: user._id,
          email: user.email,
          rol: user.rol
      };

      res.redirect('/products')
  } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ error: 'Error al iniciar sesión' });
  }
  },
  register: async(req, res)=>{
    const {first_name, last_name, age, email, password, rol} = req.body
    await userModel.create({first_name, last_name, age, email, password, rol})
    res.redirect('/user/login')
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

export default userController;