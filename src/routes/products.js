import express from "express";
import ProductManager from "../ProductManager.js";
import { readFileSync } from "fs";
import fs from 'fs';
import path from "path";
import __dirname from "../utils.js";
import multer from "multer";
const router = express.Router();
const pathProducts = path.join(__dirname, "../products.json");
const fileProducts = JSON.parse(readFileSync(pathProducts));
const productManager = new ProductManager(fileProducts);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/img");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage });


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
      productsFind: products,
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

  router.post("/create", upload.single("thumbnail"), (req, res) => {
    const { title, description, price, code, stock } = req.body;
    const thumbnail = req.file.filename;
  
    try {
      const newProduct = productManager.addProduct(
        title,
        description,
        parseFloat(price),
        thumbnail,
        parseInt(code),
        parseInt(stock)
      );
      const productsData = JSON.parse(fs.readFileSync('products.json', 'utf-8'));  
      productsData.push(newProduct);
      fs.writeFileSync('products.json', JSON.stringify(productsData, null, 2), 'utf-8');
      res.render('/index');
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

router.get("/:pid", (req, res) => {
  const id = parseInt(req.params.pid);
  try {
    productManager.getProduct();
    const product = productManager.getProductById(id);

    if (product) {
      res.render("detalleProduct", {
        title: "Detalle producto",
        product: product,
      });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "No se ah encontrado el producto indicado" });
  }
});
router.get("/edit/:pid", (req, res) =>{
  const id = parseInt(req.params.pid);
  try {
    productManager.getProduct();
    const product = productManager.getProductById(id);

    if (product) {
      res.render("editProduct", {
        title: "Detalle producto",
        product: product,
      });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "No se ah encontrado el producto indicado" });
  }
})
router.put('edit/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const { title, description, price, thumbnail, code, stock } = req.body;

  try {
    const updatedProduct = productManager.updateProduct(productId, {
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    });
    res.redirect(`/api/products/${productId}`);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.delete("/delete/:pid", (req, res) => {
  const productId = parseInt(req.params.pid);

  try {
    productManager.deleteProduct(productId);
    res.json({ message: 'Producto eliminado exitosamente', productId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
