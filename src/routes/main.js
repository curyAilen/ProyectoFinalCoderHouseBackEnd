import express from "express";
import { readFileSync } from 'fs';
import path from "path";
import ProductManager from '../ProductManager.js';
import __dirname from '../utils.js';

import multer from "multer";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage });

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
      productsFind: products
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/create", (req, res) => {
  try{
    res.render("newProduct", { title: "Nuevo Producto" });
  }catch(error){
    res.status(500).json({ error: "No se pudo cargar el formumlario" });
  }
   
  });
  

  router.post("/create", upload.single("filename"), (req, res) => {
    const { title, description, price, thumbnail, code, stock } = req.body;
    try {
      const newProduct = productManager.addProduct(
        title,
        description,
        price,
        thumbnail,
        code,
        stock
      );

      res.render("index", { products: newProduct });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  


export default router;
