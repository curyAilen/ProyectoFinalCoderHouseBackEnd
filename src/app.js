import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import cartRoutes from './routes/cartRoutes.js';
import routerMain from './routes/mainRoutes.js';
import routerUser from './routes/session.router.js';
import routerProducts from './routes/productsRoutes.js';
import MessageModel from './dao/models/messege.model.js';

const app = express();
const mongoUrl = 'mongodb+srv://ailencury:afrgafrg@dosagujas.qa302tu.mongodb.net/?retryWrites=true&w=majority'
const mongoDBName = 'dosAgujas'

import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views/partials/'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(session({
  store: MongoStore.create({
    mongoUrl,
    dbName: mongoDBName, 
    ttl: 100
  }), secret: 'secret', resave: true, saveUninitialized: true
}))

app.use('/', routerMain);
app.use('/cart', cartRoutes);
app.use('/products', routerProducts);
app.use('/user', routerUser);


mongoose.connect(mongoUrl, { dbName: mongoDBName })
  .then(() => {
    console.log('DB connected! 😎');


    const server = http.createServer(app);
    const io = new SocketIOServer(server);

    io.on('connection', async (socket) => {
      console.log(`Cliente conectado: ${socket.id}`);


      const messages = await MessageModel.find().lean().exec();
      socket.emit('messages', messages);

      socket.on('message', async (message) => {

        try {
          const newMessage = new MessageModel({
            user: message.user,
            message: message.message,
          });
          await newMessage.save();


          io.emit('message', newMessage);
        } catch (error) {
          console.error(error);
        }
      });

      socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
      });
    });



    server.listen(8080, function () {
      console.log('Listening on *:8080');
    });
  })
  .catch(error => {
    console.error('Error connecting to the DB 🚑', error);
  });