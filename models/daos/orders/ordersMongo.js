import {ContenedorMongo} from "../../managers/contenedorMongo.js";

class OrdersMongoDao extends ContenedorMongo{
    constructor(model){
        super(model)
    }
}

export {OrdersMongoDao}