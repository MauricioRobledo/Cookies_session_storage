import {ContenedorMongo} from "../../managers/contenedorMongo.js";

class CartMongoDao extends ContenedorMongo{
    constructor(model){
        super(model)
    }
}

export {CartMongoDao}