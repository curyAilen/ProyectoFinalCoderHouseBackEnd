import express from 'express';
import ProductManager from '../ProductManager.js';
import { readFileSync } from 'fs';
import path from "path";
import __dirname from '../utils.js';

const router = express.Router();
const pathProducts = path.join(__dirname, '../products.json');
const fileProducts = JSON.parse(readFileSync(pathProducts));
const productManager = new ProductManager(fileProducts);


router.get("/", (req, res) => {
    try {
      const limit = parseInt(req.query.limit);
      productManager.getProduct();
      let products = JSON.parse(productManager.getProduct());
      if (!isNaN(limit)) {
        products = products.slice(0, limit);
      }
      res.render("tienda", {
        title: "tienda",
        productsFind: products
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    try {      
      productManager.getProduct();
      const product = productManager.getProductById(productId);
  
      if (product) {
        res.render("detalleProduct", {
            title: "Detalle producto",
            product: product
          });
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  

router.post('/', (req, res) => {
  // Implementación de la ruta para agregar un nuevo producto
});

router.put('/:pid', (req, res) => {
  // Implementación de la ruta para actualizar un producto
});

router.delete('/:pid', (req, res) => {
  // Implementación de la ruta para eliminar un producto
});

export default router;
