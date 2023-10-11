import CartManager from "../CartManager.js";


const cartController = {
  addToCart: (req, res) => {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);

    try {
      const updatedCart = CartManager.addToCart(productId, quantity);
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(400).json({ error: error.message });
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

  getCart: (req, res) => {
    try {
      const cartManager = new CartManager();
      const cart = cartManager.getCart();
    /*  res.render('cart', {
        titulo: 'Cart',
        cart: cart*/
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el carrito ' + error});
    }
  }
};

export default cartController;
