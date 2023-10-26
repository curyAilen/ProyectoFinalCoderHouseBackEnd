import fs from 'fs';
import path from 'path';
import __dirname from '../utils.js';
import productsModel from '../models/products.models.js';
const pathproductos = path.join(__dirname, '../src/data/products.json');
const dataproductos = JSON.parse(fs.readFileSync(pathproductos, 'utf-8'));


const mainController = {
    main: async(req, res)=>{
        const products = await productsModel.find({}).lean().limit(6).exec()
        console.log("OK")
        res.render('home', {products})
      },
}

export default mainController;