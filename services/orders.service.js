import { getApiDao } from "../models/index.js";


const {UserDaoContainer,ProductDaoContainer, CartDaoContainer, OrdersDaoContainer} = await getApiDao();


export const getOrders = async()=>{
    return await OrdersDaoContainer.getAll()
}