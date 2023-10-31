import fs from 'fs';
import path from 'path';
import __dirname from '../utils.js';
import productsModel from '../dao/models/products.models.js';
import cartsModel from '../dao/models/carts.model.js';
// const cartFilePath  = path.join(__dirname, '../src/data/cart.json');
// const cartData = fs.readFileSync(cartFilePath, 'utf-8');
// const cart = JSON.parse(cartData);

function generateId() {
  let allProductsinCart = dataproductoinCarts;
  let lastProductinCart = allProductsinCart.pop();
  if (lastProductinCart) {
      return lastProductinCart.id + 1;
  }
  return 1;
}

const cartController = {
  addToCart: async (req, res) => {   
    try {
      const productId = req.params.cid;
      const product = await productsModel.findOne({ _id: productId }).lean().exec();
      const totalQuantity = req.body.quantity;
      console.log('OK ' + product.title)
     
      const cart = await cartsModel.create({
        products: [{ product, quantity: totalQuantity }],
        totalPrice: product.price * totalQuantity,    });

      console.log(JSON.stringify(cart, null, '\t'))
      res.status(200).json(cart);
      process.exit()
      
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener detalles del producto: ' + error.message });
    }
  },

  removeFromCart: (req, res) => {
    const productId = req.params.productId;

    try {
      
      const updatedCart = CartManager.removeFromCart(productId);
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateCartItem: (req, res) => {
    const productId = req.params.productId;
    const newQuantity = parseInt(req.body.quantity);

    try {
      const updatedCart = CartManager.updateCartItem(productId, newQuantity);
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getCart: (req, res) => {
    try { 
     res.render('cart', {
        titulo: 'Cart', 
        cart: cart
    })
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el carrito ' + error});
    }
  }
};

export default cartController;
