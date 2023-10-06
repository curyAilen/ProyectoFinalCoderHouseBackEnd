import fs from 'fs';
import path from 'path';
import __dirname from '../utils.js';
const pathproductos = path.join(__dirname, '../src/data/products.json');
const dataproductos = JSON.parse(fs.readFileSync(pathproductos, 'utf-8'));

function generateId() {
    let allProducts = dataproductos;
    let lastProduct = allProducts.pop();
    if (lastProduct) {
        return lastProduct.id + 1;
    }
    return 1;
}

const productController = {

    list: (req, res) => {
        res.render('tienda', {
            titulo: 'Listado de productos',
            productos: dataproductos
        });
    },

    detalleProducto: (req, res) => {
        const productId = parseInt(req.params.pid);

        const productoEncontrado = dataproductos.find(producto => producto.id === productId);

        if (!productoEncontrado) {
            return res.status(404).send('Producto no encontrado.');
        }

        res.render('detalleProduct', {
            titulo: 'Detalle del Producto',
            product: productoEncontrado
        });
    },

    create: (req, res) => {
        res.render('newProduct', {
            titulo: 'Crear producto nuevo',
        });
    },

    store: (req, res) => {
        if (!fs.existsSync(pathproductos)) {
            fs.writeFileSync(pathproductos, '[]', 'utf-8');
        }
    
        const newProduct = {
            id: generateId(),
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            code: req.body.code,
            thumbnail: req.file.filename
        };

        const data = fs.readFileSync(pathproductos, 'utf-8');
        const currentProducts = JSON.parse(data || '[]');
        currentProducts.push(newProduct);
        fs.writeFileSync(pathproductos, JSON.stringify(currentProducts, null, 2));    
        res.redirect('/');
    },

    edit: (req, res) => {
        let idProduct = req.params.pid;
        let findProduct = dataproductos.find((e) => {
            return e.id == idProduct;
        });
        res.render("editProduct", {
            titulo: "Editar Producto",
            product: findProduct,
        });
    },

    edited: (req, res) => {
        let idProduct = req.params.pid;
        let editProduct = {
            id: parseInt(idProduct),
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            code: req.body.code,
            thumbnail: req.file.thumbnail
        }
        for (let i = 0; i < dataproductos.length; i++) {
            if (dataproductos[i].id == editProduct.id) {
                dataproductos[i] = editProduct;
                break;
            }
        }
        fs.writeFileSync(pathproductos, JSON.stringify(dataproductos));
        res.redirect('/api/products/detail/' + idProduct);
    },

    delete: (req, res) => {
        let idProduct = req.params.pid;
        for (let i = 0; i < dataproductos.length; i++) {
            if (dataproductos[i].id == idProduct) {
                dataproductos.splice(i, 1);
                break;
            }
        }
        fs.writeFileSync(pathproductos, JSON.stringify(dataproductos));
        res.redirect('/api/products/')
    }

}

export default productController;