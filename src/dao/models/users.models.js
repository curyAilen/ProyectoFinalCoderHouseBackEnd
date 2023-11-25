import mongoose from "mongoose";
const UserModel = mongoose.model('users', new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { 
   type: String, 
   unique: true 
},
  age: Number,
  password: String,
  rol: {
    type: String,
    default: 'user'
  },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'cart' }

}))

export default UserModel