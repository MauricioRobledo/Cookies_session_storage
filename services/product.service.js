import { getApiDao } from "../models/index.js";


const {UserDaoContainer,ProductDaoContainer, CartDaoContainer, OrdersDaoContainer} = await getApiDao();


export const getProduct = async()=>{
    return await ProductDaoContainer.getAll()
}

export const getProductById = async(id)=>{
    return await ProductDaoContainer.getById(id)
}

export const saveProduct = async(body)=>{
    return await ProductDaoContainer.save(body)
}

export const updateProduct = async(id, body)=>{
    return await ProductDaoContainer.updateById(id, body)
}

export const deleteProduct = async(id)=>{
    return await ProductDaoContainer.deleteById(id)
}

export const getByCategory = async(category)=>{
    return await ProductDaoContainer.getByCategory(category)
}