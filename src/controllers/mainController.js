import fs from 'fs';
import path from 'path';
import __dirname from '../utils.js';
const pathproductos = path.join(__dirname, '../src/data/products.json');
const dataproductos = JSON.parse(fs.readFileSync(pathproductos, 'utf-8'));


const mainController = {
    main: (req, res) => {
        res.render('home', {
            titulo: 'inicio',
            products: dataproductos
        });

    }
}

export default mainController;