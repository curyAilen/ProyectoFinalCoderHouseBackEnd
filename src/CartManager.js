import fs from 'fs';

class CartManager {
    constructor() {
        this.path = 'cart.json';
        this.products = [];
        this.autoIncrementId = 1;
    }

    addToCart(productId, quantity) {
           const productsData = JSON.parse(fs.readFileSync('products.json', 'utf-8'));
        const product = productsData.find(product => product.id === productId);
    
        if (!product) {
            throw new Error('El producto no fue encontrado.');
        }
        const cartProduct = {
            id: this.autoIncrementId++,
            product: { ...product },
            quantity
        };
    
        this.products.push(cartProduct);
        this.saveCart();
        return this.products;
    }
    updateCart(productId, newQuantity) {
        const cartProduct = this.products.find(product => product.product.id === productId);
    
        if (!cartProduct) {
            throw new Error('El producto no está en el carrito.');
        }
    
        cartProduct.quantity = newQuantity;
        this.saveCart();
        return this.products;
    }
    

    removeFromCart(productId) {
        this.products = this.products.filter(product => product.product.id !== productId);
        this.saveCart();
        return this.products;
    }

    saveCart() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
    }

    getCart() {
        return fs.readFileSync(this.path, 'utf-8') || [];
    }
}

export default CartManager;


const cartManager = new CartManager();


cartManager.addToCart(1, 3); 
cartManager.addToCart(2, 2); 
cartManager.addToCart(3, 20); 
cartManager.addToCart(5, 15); 



const cart = cartManager.getCart();
//console.log('Carrito:', cart);

cartManager.updateCart(2, 0);
const updatedCart = cartManager.getCart();
console.log('Carrito actualizado:', updatedCart);

cartManager.removeFromCart(2);
const updatedCartAfterRemoval = cartManager.getCart();
//console.log('Carrito después de eliminar producto:', updatedCartAfterRemoval);
