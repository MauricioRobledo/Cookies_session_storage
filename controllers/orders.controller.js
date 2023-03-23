import * as services from "../services/orders.service.js"

export const getOrdersController = async(req,res)=>{
    try {
        const result = await services.getOrders() 
        res.status(200).json({data:result})
    } catch(error){
        res.status(400).json({message:`Hubo un error ${error}`})
    }
}