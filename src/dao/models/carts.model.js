import mongoose from 'mongoose';

const cartsCollection = 'carts';
const cartSchema = new mongoose.Schema({
    products: [
        {
            productId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'products' 
            },
            quantity: Number,
        },
    ],
    totalPrice: Number, 
});

const cartsModel = mongoose.model(cartsCollection, cartSchema);

export default cartsModel;
