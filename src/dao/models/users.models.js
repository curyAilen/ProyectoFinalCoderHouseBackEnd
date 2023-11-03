import mongoose from "mongoose";
const usersCollection = 'users';
const usersSchema = new mongoose.Schema({
    name: String,
    last_name: String,
    age: Number,
    password: String,
    email: { 
        type: String, 
        unique: true 
   },
 });

 const usersModel = mongoose.model(usersCollection, usersSchema);
 export default usersModel;
