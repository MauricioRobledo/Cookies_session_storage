import * as services from "../services/product.service.js";


export const getProductController = async(req,res)=>{
    try {
        const products = await services.getProduct() 
        res.status(200).json({data:products})
    } catch(error){
        res.status(400).json({message:`Hubo un error ${error}`})
    }
}

export const getProductByIdController = async(req,res)=>{
    try {
        const product = await services.getProductById(req.params.id)
        res.status(200).json({data:product})
    } catch(error){
        res.status(400).json({message:`Hubo un error ${error}`})
    }
}

export const saveProductController = async(req,res)=>{
    try {
        const result = await services.saveProduct(req.body)
        res.status(200).json({message:result})
    } catch(error){
        res.status(400).json({message:`Hubo un error ${error}`})
    }
}

export const updateProductController = async(req,res)=>{
    try {
        const updatedProduct = await services.updateProduct(req.params.id, req.body)
        res.status(200).json({data:`Producto actualizado: ${updatedProduct}`})
    } catch(error){
        res.status(400).json({message:`Hubo un error ${error}`})
    }
}

export const deleteProductController = async(req,res)=>{
    try {
        await services.deleteProduct(req.params.id)
        res.status(200).json({message:"Producto eliminado"})
    } catch(error){
        res.status(400).json({message:`Hubo un error ${error}`})
    }
}

export const getByCategoryController = async(req,res)=>{
    try {
        const product = await services.getByCategory(req.params.category)
        res.status(200).json({data:product})
    } catch(error){
        res.status(400).json({message:`Hubo un error ${error}`})
    }
}