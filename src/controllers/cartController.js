import {__dirname} from "../utils.js";
import productsModel from "../dao/models/products.models.js";
import cartsModel from "../dao/models/carts.model.js";

const cartController = {
  addToCart: async (req, res) => {
    try {
      const productId = req.params.pid;
      const product = await productsModel.findOne({ _id: productId }).lean().exec();
      const cartId = req.params.cid;    
      const cart = await cartsModel.findOne({ _id: cartId }).lean().exec();    
      if (!cart) {
        const titulo = "Lo sentimos";
        const mensaje= "No se pudo encontrar el carrito."
        res.render('error', {titulo, mensaje})
      }    
      if (!cart.products) {
        cart.products = [];
      }    
      const totalQuantity = req.body.quantity;
      const totalPrice = product.price * totalQuantity;
      const newProductInCart = {
        productId: product._id,
        quantity: totalQuantity,
      };    
      cart.products.push(newProductInCart);
      if (!cart.totalPrice) {
        cart.totalPrice = 0;
      }    
      cart.totalPrice += totalPrice;
      await cartsModel.updateOne({ _id: cartId }, cart);
      res.redirect(302, '/api/cart/getCart/' + cartId);
    } catch (error) {
      const titulo = "Lo sentimos";
        const mensaje= "No se pudo encontrar el carrito."
        res.render('error', {titulo, mensaje})
      res.status(500).json({
        error: "Error al agregar el producto al carrito: " + error.message,
      });
    }
  },
  remove: async (req, res) => {
    try {
      const productId = req.params.pid;
      const product = await productsModel.findOne({_id: productId}).lean().exec();
      const cartId = req.params.cid;
      const cart =  await cartsModel.findOne({_id: cartId}).lean().exec();
      
      if(!product){
        const titulo = "Lo sentimos, ha ocurrido un error.";
        const mensaje= "No hemos podido encontrar el producto solicitado."
        res.render('error', {titulo, mensaje})
      }     

      const updatedCart = await cartsModel.findOneAndUpdate(
        { _id: cart },
        { $pull: { products: { productId: productId } } },
        { new: true }
      );
  
      if (!updatedCart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
        res.redirect('/api/cart/getCart/'+ cart)
   
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      res.status(500).json({ error: "Error al eliminar el producto" });
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
      const cart = await cartsModel.findOne({ _id: cartId }).lean().exec();
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
