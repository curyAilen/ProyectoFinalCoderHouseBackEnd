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
  rol: String
}))

export default UserModel