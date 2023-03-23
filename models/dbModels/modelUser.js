import mongoose from "mongoose";


const usersCollection = "users";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    adress:{
        type: String,
        required:true
    },
    age:{
        type: Number,
        required:true
    },
    phone:{
        type: Number,
        required:true
    },
    username:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    picture:{
        type: String,
        required:true
    },
});

export const UserModel = mongoose.model(usersCollection, userSchema);