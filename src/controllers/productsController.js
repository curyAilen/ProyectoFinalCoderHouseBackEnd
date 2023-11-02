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
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
      
            const options = {
              page,
              limit,
              lean: true,
            };
      
            const result = await productsModel.paginate({}, options);
      
            const pagination = {
              totalPages: result.totalPages,
              prevPage: result.hasPrevPage ? page - 1 : null,
              nextPage: result.hasNextPage ? page + 1 : null,
              hasPrevPage: result.hasPrevPage,
              hasNextPage: result.hasNextPage,
            };
      
            res.render('realtimeproducts', {
              products: result.docs,
              pagination,
            });
          } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
          }
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

    store: async (req, res) => {
        try {
          const { title, description, price, stock, code, thumbnail } = req.body;
          const ext = req.file.originalname.split('.').pop();
          const newProduct = await productsModel.create({
            title: title,
            description: description,
            price: price,
            stock: stock,
            code: code,
            thumbnail: thumbnail+ "."+ ext
          });
     
          console.log('Producto guardado:', newProduct);
          res.redirect('/products/detail/' + newProduct._id); 
        } catch (error) {
          res.status(500).send("No se puede agregar el producto: " + error);
        }
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