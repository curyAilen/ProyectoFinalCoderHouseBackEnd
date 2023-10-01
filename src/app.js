import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import routerMain from './routes/main.js';
import routerProducts from './routes/products.js'
const app = express();

app.engine('handlebars', handlebars.engine());
app.set ('views', __dirname+'/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'));
app.use(express.static( __dirname + '/views/partials/'))



app.use('/', routerMain);
app.use('/api/products/', routerProducts)

const server = app.listen(8080, () => {
    console.log(`Servidor en funcionamiento en el puerto localhost:8080`);
});
server;


