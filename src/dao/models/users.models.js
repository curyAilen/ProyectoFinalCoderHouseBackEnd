import mongoose from "mongoose";
const UserModel = mongoose.model('users', new mongoose.Schema({
  userName: String,
  last_name: String,
  email: { 
   type: String, 
   unique: true 
},
  age: Number,
  password: String
}))

export default UserModel