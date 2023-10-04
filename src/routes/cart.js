import express from "express";
import ProductManager from "../ProductManager.js";
import fs from 'fs';
import { readFileSync } from "fs";
import path from "path"; 
import __dirname from "../utils.js";
import CartManager from '../CartManager.js';
const router = express.Router();
const pathProducts = path.join(__dirname, "../products.json");
const fileProducts = JSON.parse(readFileSync(pathProducts));
const productManager = new ProductManager(fileProducts);

const cartManager = new CartManager();

router.get("/", (req, res) => {
  try {
    const cart = cartManager.getCart();
    let products = JSON.parse(cart);
    res.render('cart', { title: 'Carrito', cart: products});
   
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
    const { id, quantity } = req.body;
    cartManager.addToCart(id, parseInt(quantity));
    const cart = cartManager.getCart(); 
    res.render('cart', {
        title: 'Carrito',
        cart: cart  ,
        productId: productId
    });
});


router.get('/:cid ', (req, res)=>{
    res.render('cart', { title: 'Carrito', cart });
})

router.put('/update/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const { quantity } = req.body;

  try {
      cartManager.updateCart(productId, parseInt(quantity));
      res.status(200).send('Cantidad del producto actualizada correctamente.');
  } catch (error) {
      res.status(404).send('Producto no encontrado en el carrito.');
  }
});
router.post('/:cid/product/:pid', (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);

  const productsData = JSON.parse(fs.readFileSync('products.json', 'utf-8'));
  const product = productsData.find(product => product.id === productId);
  if (!product) {
      return res.status(404).send('Producto no encontrado.');
  }
  const cart = cartManager.getCart();
  const existingProductIndex = cart.findIndex(item => item.product.id === productId);

  if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity++;
  } else {
      const cartProduct = {
          id: cartManager.autoIncrementId++,
          product: { ...product },
          quantity: 1
      };
      cart.push(cartProduct);
  }

  cartManager.saveCart(cart);

  res.status(200).send('Producto agregado al carrito correctamente.');
});

router.delete('/remove/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);

  try {
      cartManager.removeFromCart(productId);
      res.status(200).send('Producto eliminado del carrito correctamente.');
  } catch (error) {
      res.status(404).send('Producto no encontrado en el carrito.');
  }
});




export default router;

