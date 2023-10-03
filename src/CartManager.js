import fs from 'fs';

class CartManager {
    constructor() {
        this.path = 'cart.json';
        this.products = [];
        this.autoIncrementId = 1;
    }
    
    addToCart(productId, quantity) {
        const productIndex = this.products.findIndex(item => item.product.id === productId);
    
        if (productIndex !== -1) {
            this.products[productIndex].quantity += quantity;
        } else {
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
        }
    
        this.saveCart();
        return this.products;
    }
    saveCart() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
    }

    getCart() {
        return fs.readFileSync(this.path, 'utf-8') || [];
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

    
}

export default CartManager;
