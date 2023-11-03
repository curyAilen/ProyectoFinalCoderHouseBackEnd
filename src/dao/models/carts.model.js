import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    products: {
        type: [
        {
            productId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'products' 
            },
            quantity: Number,
        },
    ]},
   
    totalPrice: Number, 
});
cartSchema.pre('findOne', function() {
    this.populate('products.productId')
})

const cartsModel = mongoose.model("carts", cartSchema);

export default cartsModel;
