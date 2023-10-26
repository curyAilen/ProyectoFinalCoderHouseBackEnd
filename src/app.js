import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import mongoose from 'mongoose';
import cartRoutes from './routes/cartRoutes.js';
import routerMain from './routes/mainRoutes.js';
import routerProducts from './routes/productsRoutes.js';

const app = express();
const mongoURL = 'mongodb+srv://ailencury:afrgafrg@dosagujas.qa302tu.mongodb.net/?retryWrites=true&w=majority'
const mongoDBName = 'dosAgujas'

import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
const server = http.createServer(app);
const io = new SocketIOServer(server);;
const messages = [];

io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);
    socket.emit('messages', messages);    
    socket.on('message', (message) => {
      messages.push({ socketId: socket.id, message });
      io.emit('message', { socketId: socket.id, message });
    });
    
    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });


app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars.engine());
app.set ('views', __dirname+'/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'));
app.use(express.static( __dirname + '/views/partials/'))

app.use('/', routerMain);
app.use('/api/cart', cartRoutes);
app.use('/api/products', routerProducts);

mongoose.connect(mongoURL, { dbName: mongoDBName})
    .then(() => {
        console.log('DB connected! 😎 ')
        app.listen(8080, () => console.log(`Listening 🏃...`)) 
    })
    .catch(error => {
        console.error('Error connect DB 🚑 ')
    })