import express from 'express';
import handlebars from 'express-handlebars';
import {__dirname, setUserSession} from './utils.js';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import methodOverride from 'method-override';

import cartRoutes from './routes/cartRoutes.js';
import routerMain from './routes/mainRoutes.js';
import routerUser from './routes/userRouters.js';
import routerViews from './routes/viewsRoutes.js';
import routerProducts from './routes/productsRoutes.js';
import MessageModel from './dao/models/messege.model.js';

const app = express();
const mongoUrl = 'mongodb+srv://ailencury:afrgafrg@dosagujas.qa302tu.mongodb.net/?retryWrites=true&w=majority'
const mongoDBName = 'dosAgujas'

import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
const hbs = handlebars.create({
  helpers: {
    eq: function (a, b, options) {
      return a === b ? options.fn(this) : options.inverse(this);
    },
  },
});
app.engine('handlebars', hbs.engine);

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views/partials/'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(methodOverride(function(req,res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use(session({
  store: MongoStore.create({
      mongoUrl,
      dbName: mongoDBName,
      ttl: 100
  }),
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

app.use(setUserSession)

app.use('/', routerMain);
app.use('/api/cart', cartRoutes);
app.use('/api/products', routerProducts);
app.use('/api/user', routerUser);
app.use('/api', routerViews);


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