import { ContenedorMongo } from "../../managers/contenedorMongo.js";

class ProductMongoDao extends ContenedorMongo{
    constructor(model){
        super(model)
    }
}

export {ProductMongoDao}