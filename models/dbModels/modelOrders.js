import mongoose from "mongoose";

const ordersCollection = "ordenes"

const ordersSchema = new mongoose.Schema({

    _id:{
        type: Number,
        required: true
    },
    timestamp:{
        type: Number,
        required: true
    },
    products:{
        type: Array,
        required: true
    },
    status:{
        type: String,
        default: "generada",
        required: true
    },
    email:{
        type: String,
        required: true
    }
})



export const ordersModel = mongoose.model(ordersCollection, ordersSchema)