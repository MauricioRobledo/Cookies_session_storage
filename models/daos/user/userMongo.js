import { ContenedorMongo } from "../../managers/contenedorMongo.js";

class UserMongoDao extends ContenedorMongo{
    constructor(model){
        super(model)
    }
}

export {UserMongoDao}