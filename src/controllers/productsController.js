import fs from 'fs';
import path from 'path';
import __dirname from '../utils.js';
import {io} from 'socket.io-client';
import productsModel from '../dao/models/products.models.js';

const pathproductos = path.join(__dirname, '../src/data/products.json');
const dataproductos = JSON.parse(fs.readFileSync(pathproductos, 'utf-8'));
const socket = io();

function generateId() {
    let allProducts = dataproductos;
    let lastProduct = allProducts.pop();
    if (lastProduct) {
        return lastProduct.id + 1;
    }
    return 1;
} 

const productController = {

    list: async(req, res)=>{
       // const products = await productsModel.find({}).lean().exec()
  
        const page = parseInt(req.query?.page ?? 1);
        const limit = 10;
      
        const result = await productsModel.paginate({}, {
            page,
            limit,
            lean: true 
        })
    
        result.prevLink = result.hasPrevPage ? `/?page=${result.prevPage}&limit=${limit}` : '';
        result.nextLink = result.hasNextPage ? `/?page=${result.nextPage}&limit=${limit}` : '';
        res.render('realtimeproducts', { products: result.docs, pagination: result });
      },

    detailProduct: async(req, res) => {
        try {
            const id = req.params.pid
            const product = await productsModel.findOne({ _id: id }).lean().exec()
            res.render('detalleProduct', {product})
        } catch (error) {
            res.send({error: 'No se encuentra el producto'})
        }
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
        let pid = req.params.pid;
        let editProduct = {
            id: parseInt(pid),
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
        res.redirect('/products/detail/' + pid);
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
        res.redirect('/products/')
    }

}

export default productController;