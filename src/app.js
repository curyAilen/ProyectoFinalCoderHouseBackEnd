import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
//RUTAS X CONTROLLER
import cartRoutes from './routes/cartRoutes.js';
import routerMain from './routes/mainRoutes.js';
import routerProducts from './routes/productsRoutes.js';
const app = express();

app.engine('handlebars', handlebars.engine());
app.set ('views', __dirname+'/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'));
app.use(express.static( __dirname + '/views/partials/'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/', routerMain);
app.use('/api/cart', cartRoutes);
app.use('/api/products', routerProducts);



app.listen(8080, () => {
  console.log('Servidor en ejecución en el puerto 8080');
 
});
