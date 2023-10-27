import fs from 'fs';
import path from 'path';
import __dirname from '../utils.js';
const cartFilePath  = path.join(__dirname, '../src/data/cart.json');
const cartData = fs.readFileSync(cartFilePath, 'utf-8');
const cart = JSON.parse(cartData);

function generateId() {
  let allProductsinCart = dataproductoinCarts;
  let lastProductinCart = allProductsinCart.pop();
  if (lastProductinCart) {
      return lastProductinCart.id + 1;
  }
  return 1;
}

const cartController = {
  addToCart2: (req, res) => {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);

    try {
      const updatedCart = CartManager.addToCart(productId, quantity);
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  addToCart: (req, res) => {
    const pid = req.params.pid;
    const quantity = req.body.quantity;

    if (!fs.existsSync(pathcart)) {
      fs.writeFileSync(pathcart, '[]', 'utf-8');    }
    const productDetails = getProductDetailsById(pid);
    if (!productDetails) {
      res.status(404).json({ error: 'Producto no encontrado.' });
      return;
    }
    const newProductinCart = {
      id: generateId(),
      ...productDetails,
      quantity: parseInt(quantity),
        };
    const data = fs.readFileSync(pathcart, 'utf-8');
    const currentProductsinCart = JSON.parse(data || '[]');
    currentProductsinCart.push(newProductinCart);
    fs.writeFileSync(pathcart, JSON.stringify(currentProductsinCart, null, 2));
    res.redirect('/');
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
