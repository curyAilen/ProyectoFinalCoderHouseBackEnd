import express from "express";
import ProductManager from "../ProductManager.js";
import { readFileSync } from "fs";
import path from "path";
import __dirname from "../utils.js";
import CartManager from '../CartManager.js';
const router = express.Router();
const pathProducts = path.join(__dirname, "../products.json");
const fileProducts = JSON.parse(readFileSync(pathProducts));
const productManager = new ProductManager(fileProducts);

const cartManager = new CartManager();

router.get('/', (req, res) => {
    const cart = cartManager.getCart();
    res.render('cart', { title: 'Carrito', cart });
  
});

router.post('/add', (req, res) => {
    const { id, quantity } = req.body;
    cartManager.addToCart(id, parseInt(quantity));
    const cart = cartManager.getCart(); 
    res.render('cart', {
        title: 'Carrito',
        cart: cart  
    });
});


router.get('/:cid ', (req, res)=>{
    res.render('cart', { title: 'Carrito', cart });
})

router.delete('/:pid', (req, res) =>{
    const productId = parseInt(req.params.pid);  
    try {
      productManager.deleteProduct(productId);
      const updatedProducts = productManager.getProduct();
      writeFileSync(pathProducts, JSON.stringify(updatedProducts, null, 2));
      res.status(200).send('Producto eliminado correctamente.');
    } catch (error) {
      res.status(404).send('Producto no encontrado.');
    }
  });

export default router;

