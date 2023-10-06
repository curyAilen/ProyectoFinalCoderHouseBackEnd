import fs from 'fs';

class ProductManager {
    constructor() {
        this.path = 'products.json';
        this.products = [];
        this.autoIncrementId = 1;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error('Los campos son obligatorios');
        }
        const productExist = this.products.find(product => product.code === code);
        if (productExist) {
            throw new Error('Ya existe un Producto con ese ID');
        }
        const newProduct = {
            id: this.autoIncrementId++, 
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };
        this.products.push(newProduct);
        this.saveProduct();
        return JSON.parse(fs.readFileSync(this.path, 'utf-8')) || [];
    }

    saveProduct() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
    }

    getProduct() {
        return fs.readFileSync(this.path, 'utf-8') || [];
    }

    getProductById(id) {
        const data = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
        const productIdFind = data.find(productFind => productFind.id === id);
        if (!productIdFind) {
            return console.error('Not Found');
        }
        return productIdFind; 
    }

    updateProduct(id, updateData) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            throw new Error('El producto no fue encontrado.');
        }
        updateData.id = this.products[productIndex].id;
        this.products[productIndex] = {
            ...this.products[productIndex],
            ...updateData
        };
        this.saveProduct();
        return this.products[productIndex];
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            throw new Error('El producto no fue encontrado.');
        }
        this.products.splice(productIndex, 1);
        this.saveProduct();
    }
}

export default ProductManager;


