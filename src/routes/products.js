import express from "express";
import ProductManager from "../ProductManager.js";
import { readFileSync } from "fs";
import path from "path";
import __dirname from "../utils.js";
const router = express.Router();
const pathProducts = path.join(__dirname, "../products.json");
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
      productsFind: products,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:pid", (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    productManager.getProduct();
    const product = productManager.getProductById(productId);

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
  const productId = parseInt(req.params.pid);
  try {
    productManager.getProduct();
    const product = productManager.getProductById(productId);

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
router.put("/edit/:pid", (req, res) => {
  const productId = parseInt(req.params.pid);
  const updateData = req.body;

  try {
    const updatedProduct = productManager.updateProduct(productId, updateData);
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
