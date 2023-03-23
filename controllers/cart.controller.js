import * as services from "../services/cart.service.js";


export const getCartController = async(req,res)=>{
    try {
        const cart = await services.getCart()
        res.status(200).json({data:cart})
    } catch(error){
        res.status(400).json({message:`Hubo un error ${error}`})
    }
}


export const getProductOfCartController = async(req,res)=>{
    try {
        const product = await services.getProductOfCartById(req.params.id)
        res.status(200).json({data:product})
    } catch(error){
        res.status(400).json({message:`Hubo un error ${error}`})
    }
}

export const createCartController = async(req,res)=>{
    try {
        const result = await services.createCart(req.body.adress)
        res.status(200).json({message:result})
    } catch(error){
        res.status(400).json({message:`Hubo un error ${error}`})
    }
}

export const saveCartProductController = async(req,res)=>{
    try {
        const id = req.params.id
        const idProd = req.body.id
        const result = await services.saveCartProducts(id, idProd)
        res.status(200).json({message:result})
    } catch(error){
        res.status(400).json({message:`Hubo un error ${error}`})
    }
}


export const deleteCartController = async(req,res)=>{
    try {
        await services.deleteCart(req.params.id)
        res.status(200).json({message:"carrito eliminado"})
    } catch(error){
        res.status(400).json({message:`Hubo un error ${error}`})
    }
}

export const deleteCartProductController = async(req,res)=>{
    try {
        const id = req.params.id
        const idProd = req.params.idProd
        await services.deleteCartProduct(id, idProd)
        res.status(200).json({message:"Producto eliminado del carrito"})
    } catch(error){
        res.status(400).json({message:`Hubo un error ${error}`})
    }
}

export const emailOrderCartController = async(req,res)=>{
    try {
        const email = req.body.email
        const result = await services.emailOrderCart(req.params.id, email)
        res.status(200).json({message:result})
    } catch(error){
        res.status(400).json({message:`Hubo un error ${error}`})
    }
}
