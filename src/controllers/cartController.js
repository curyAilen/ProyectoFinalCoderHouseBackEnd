import __dirname from "../utils.js";
import productsModel from "../dao/models/products.models.js";
import cartsModel from "../dao/models/carts.model.js";

const cartController = {
 cart: async(req, res)=>{
  try{
    const cart =  await cartsModel.findOne({_id: '6543d89a5809bb6f30617071'});
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
  }
  const totalQuantity = cart.products.reduce((total, product) => total + product.quantity, 0);
console.log(totalQuantity)
        return ({ totalQuantity });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al calcular la cantidad total' });
    }  

},
  addToCart: async (req, res) => {
    try {
      const productId = req.params.cid;
      const product = await productsModel.findOne({_id: productId}).lean().exec();
      if(!product){
        return res.status(404).json({error: "Producto no encontrado"});
      }
     
    const totalQuantity = req.body.quantity;
    const totalPrice = product.price * totalQuantity;
    const newProductInCart = {
      productId: product._id,
      quantity: totalQuantity,
     };
     const cart =  await cartsModel.findOne({_id: '6543d89a5809bb6f30617071'});
     cart.products.push(newProductInCart);
    cart.totalPrice += totalPrice;
    await cart.save();  
    res.redirect(302, '/cart/getCart/')
    }catch(error){
      res.status(500).json({
      error: "Error al agregar el producto al carrito: " + error.message,
      });
    }
  },
  remove: async (req, res) => {
    try {
      const productId = req.params.cid;
      const product = await productsModel.findOne({_id: productId}).lean().exec();
      if(!product){
        return res.status(404).json({error: "Producto no encontrado"});
      }
      const cart =  await cartsModel.findOne({_id: '6543d89a5809bb6f30617071'});
      const updatedCart = await cartsModel.findOneAndUpdate(
        { _id: cart },
        { $pull: { products: { productId: productId } } },
        { new: true }
      );
  
      if (!updatedCart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
        res.redirect('/cart/getCart')
   
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
      const cart = await cartsModel.findOne({ _id: '6543d89a5809bb6f30617071' }).lean().exec();
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
