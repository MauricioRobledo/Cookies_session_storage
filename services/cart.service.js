import { getApiDao } from "../models/index.js";
import twilio from "twilio";
import { createTransport } from 'nodemailer';
import {config} from "../config/config.js"



const {UserDaoContainer,ProductDaoContainer, CartDaoContainer, OrdersDaoContainer} = await getApiDao();


export const getCart = async()=>{
    return await CartDaoContainer.getAll()
}

export const createCart = async(body)=>{
    const cart = {
        timestamp: Date.now(),
        products: [],
        adress: body
    }
    return await CartDaoContainer.save(cart)
}


export const getProductOfCartById = async(id)=>{
    const cartResponse = await CartDaoContainer.getById(id)
    const products = cartResponse[0].products
    return products
}


export const saveCartProducts = async(id, idProd)=>{
    const product = await ProductDaoContainer.getById(idProd)
    if(product.length !== 0){
        return await CartDaoContainer.addProduct(id, product)    
    }else{
        return "No se puede agregar un producto no existente"
    }
    
}

export const deleteCart = async(id)=>{
    return await CartDaoContainer.deleteById(id)
}

export const deleteCartProduct = async(id, idProd)=>{
    const product = await ProductDaoContainer.getById(idProd)
    return await CartDaoContainer.removeProduct(id, product)
}






export const emailOrderCart = async(id, email)=>{
    //seteo de twilio
    const accountId = config.twillioAccountId
    const authToken = config.twillioAuthToken
    
    const client = twilio(accountId,authToken)

    //seteo del email nodemailer

    const TEST_EMAIL = config.email
    const TEST_PASSWORD = config.nodemailerPassword
    const transporter = createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: TEST_EMAIL,
            pass: TEST_PASSWORD
        },
        SECURE:false,
        tls:{
            rejectUnauthorized:false
        }
    });
    

    const cartResponse = await CartDaoContainer.getById(id);
    try{

        //manda un email y un mensaje de texto y whatsapp con los datos de las ordenes generadas 
        const response = await transporter.sendMail({
            from:"Servidor de NodeJs",
            to:TEST_EMAIL,
            subject:"Nuevo pedido de usuario",
            text: JSON.stringify(cartResponse)
        })
        
        client.messages.create({
            from:"whatsapp:+14155238886",
            body: JSON.stringify(cartResponse),
            to:`whatsapp:${config.number}`
        })
        client.messages.create({
            from:"+13342747804",
            body: "Pedido recibido y en proceso",
            to: config.number
        })
        // Guarda los datos de la orden en una base de datos y elimina el carro que fue "Comprado"
        const result = await OrdersDaoContainer.saveOrder(cartResponse, email)
        console.log(result)
        if(result === "OK"){
            await CartDaoContainer.deleteById(id)
            return("Orden Generada")
        }else{
            return result
        }
        
    } catch (error){
        return error
    }
}
