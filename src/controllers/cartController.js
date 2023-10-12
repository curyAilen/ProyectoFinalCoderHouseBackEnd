//import CartManager from "../CartManager.js";
import fs from 'fs';
import path from 'path';
import __dirname from '../utils.js';
const pathcart = path.join(__dirname, '../src/data/cart.json');

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

    // Verifica si el archivo cart.json existe, si no, lo crea
    if (!fs.existsSync(pathcart)) {
      fs.writeFileSync(pathcart, '[]', 'utf-8');
    }

    // Aquí deberías obtener los detalles del producto según su id (pid)
    // Supongo que tienes una función getProductDetailsById para obtener estos detalles
    const productDetails = getProductDetailsById(pid);

    if (!productDetails) {
      res.status(404).json({ error: 'Producto no encontrado.' });
      return;
    }

    // Crear el objeto del nuevo producto en el carrito
    const newProductinCart = {
      id: generateId(),
      ...productDetails,
      quantity: parseInt(quantity),
    };

    // Leer los productos actuales en el carrito
    const data = fs.readFileSync(pathcart, 'utf-8');
    const currentProductsinCart = JSON.parse(data || '[]');

    // Agregar el nuevo producto al carrito
    currentProductsinCart.push(newProductinCart);

    // Guardar los productos actualizados en el carrito
    fs.writeFileSync(pathcart, JSON.stringify(currentProductsinCart, null, 2));

    // Redireccionar a la página principal o a donde desees
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
      const cartManager = new CartManager();
      const cart = cartManager.getCart();
    /*  res.render('cart', {
        titulo: 'Cart',
        cart: cart*/
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el carrito ' + error});
    }
  }
};

export default cartController;
