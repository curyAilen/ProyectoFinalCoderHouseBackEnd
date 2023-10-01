import express from "express";
import { readFileSync } from 'fs';
import path from "path";
import ProductManager from '../ProductManager.js';
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
    res.render("index", {
      title: "Inicio",
      productsFind: fileProducts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
