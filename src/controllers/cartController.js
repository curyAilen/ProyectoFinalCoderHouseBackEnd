import __dirname from "../utils.js";
import productsModel from "../dao/models/products.models.js";
import cartsModel from "../dao/models/carts.model.js";

const cartController = {
  addToCart: async (req, res) => {
    try {
      const cartId = '654304cf7b881d111b3532a5'; 
      const cart = await cartsModel.findOne({ _id: cartId }).lean().exec();
      
      if (!cart) {
        return res.status(404).json({ error: "No se encontró el carrito" });
      }  
      const productId = req.params.cid;
      const product = await productsModel.findOne({ _id: productId }).lean().exec();  

      if (!product) {
        return res.status(404).json({ error: "No se encontró el producto" });
      }  
      const totalQuantity = req.body.quantity;
      const totalPrice = product.price * totalQuantity;  
      const newProductInCart = { product, quantity: totalQuantity };
      cart.products.push(newProductInCart);        
      await cartsModel.updateOne({ _id: cartId }, { products: cart.products });
  
    
      res.redirect('/cart/getCart/'); 
    } catch (error) {
      res.status(500).json({
        error: "Error al agregar el producto al carrito: " + error.message,
      });
    }
  },
  remove: async(req, res) => {
  const productId = req.params.cid;
    try {
      const product = await cartsModel.findOne({products:{_id: productId} }).lean().exec();

      if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }else{
       await cartsModel.deleteOne({_id:productId})
     res.redirect('/cart/getCart')
      }    
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      res.status(500).json({ error: "Error al eliminar el producto" });
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

  getCart: async (req, res) => {
    try {
      const cartId = req.params.cid;
      const cart = await cartsModel.findOne({ _id: '654304cf7b881d111b3532a5' }).lean().exec();
      if (!cart) {
        return res.status(404).json({ error: "No se encontro el carrito " });
      }
      res.render("cart", {
        titulo: "Cart",
        cart: cart,
      });
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el carrito " + error });
    }
  },
};

export default cartController;
