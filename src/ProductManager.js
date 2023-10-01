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


////////////////////// T E S T E R /////////////////////// 

const productManager = new ProductManager();
const product1 = productManager.addProduct("Creación de identidad de marca", "La creación de identidad de marca es un proceso creativo y estratégico en el cual se diseñan los elementos visuales y conceptuales que representarán la esencia y personalidad de una marca. Incluye la definición de aspectos como el logotipo, colores, tipografías, voz de la marca y otros elementos gráficos. Este proceso puede dividirse en etapas que abarcan la investigación, conceptualización, diseño, revisiones y entrega final. Los tiempos de demora varían según la complejidad del proyecto, pero generalmente oscilan entre semanas a meses, dependiendo del alcance y requisitos específicos de la marca.", 45000, "BarajaLogo.png", 27388466, 1, 0);
const product2 = productManager.addProduct("Digitaclización de logo", "La digitalización de un logo implica transformar un diseño existente en una versión digital, apta para su uso en plataformas digitales. Incluye la recreación del diseño en software gráfico y ajustes necesarios para asegurar calidad y versatilidad. Los tiempos de demora suelen ser cortos, generalmente de días a semanas, dependiendo de la complejidad del diseño y la rapidez del diseñador.", 35000, "SClogo.jpg", 56468476 ,2, 0);
const product3 = productManager.addProduct("Creación de video institucional", "La creación de un video institucional involucra la conceptualización, guion, filmación, edición y producción de un video que presenta la identidad, valores y mensaje de una empresa. Requiere coordinación entre profesionales de guion, dirección, producción y edición. Los tiempos de demora varían según la duración y complejidad, siendo de semanas a meses.", 1150000, "YrucLogo.jpg", 4672488246625 ,3, 0);
const product4 = productManager.addProduct("Creación de una infografía estatica", "La creación de una infografía implica el diseño gráfico y visualización de datos complejos en una forma clara y atractiva. Incluye la conceptualización, diseño, selección de colores, tipografía y elementos gráficos. Los tiempos de demora dependen de la complejidad y diseño, generalmente varían de días a semanas.", 35000, "SClogo.jpg", 37828422 ,4, 0);
const product5 = productManager.addProduct("Creación de un video infográfico", "La creación de un video infográfico involucra la combinación de elementos visuales y narrativos para comunicar información compleja de manera efectiva. Incluye la conceptualización, diseño gráfico, animaciones, selección de voz en off y música, y edición de video. Los tiempos de demora varían según la duración y complejidad, desde semanas hasta meses, dependiendo del proyecto.", 35000, "YrucLogo.jpg", 46364783426 ,5, 0);

