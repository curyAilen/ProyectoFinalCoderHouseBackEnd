import {__dirname, hashPassword } from '../utils.js';
//import productsModel from '../dao/models/products.models.js';
import userModel from '../dao/models/users.models.js';
import bcrypt from 'bcrypt';



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
        res.redirect('/api/user/login');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }
      req.session.user = user;
      res.redirect('/');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ error: 'Error al iniciar sesión' + error});
    }
  },
  register: async(req, res)=>{
    try{
    const { first_name, last_name, age, email, password, rol} = req.body;
    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }
    const hashedPassword = await hashPassword(password);

   await userModel.create({
      first_name, 
      last_name, 
      age,
      email,
      password: hashedPassword,
      rol
    });

    res.redirect('/api/user/login')
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor' + error});
  }
  },
  dashboard: async(req, res)=>{
    try{
      if(req.session.user){
        return res.render('dashboard')
    }
      return res.redirect('/api/user/login')
    
    }catch(error){
      res.status(500).json({ error: 'Error al ingresar al dashboard' });
    } 
  },
  logout: (req,res)=>{
    req.session.destroy(err => {
      if(err) return res.send('Logout error')

      res.redirect('/')
  })
}
}


export default userController;