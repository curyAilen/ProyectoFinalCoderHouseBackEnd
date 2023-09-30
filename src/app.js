import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import routerMain from './routes/main.js';

const app = express();
app.engine('handlebars', handlebars.engine());
app.set ('views', __dirname+'/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'));

import ProductManager from './productManager.mjs';

const productManager = new ProductManager();

app.use('/', routerMain);






const server = app.listen(8080, () => {
    console.log(`Servidor en funcionamiento en el puerto localhost:8080`);
});
server;


