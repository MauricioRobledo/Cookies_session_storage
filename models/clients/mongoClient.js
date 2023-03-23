import mongoose from "mongoose";
import {config} from "../../config/config.js"

//clase para conectarme a la db
class MyMongoClient{
    constructor(){
        this.client = mongoose;
    }

    //metodos para conectarme a la db
    async connect(){
        try {
            this.client.set('strictQuery', false);
            await this.client.connect(config.mongoUrl);
            console.log("conexion exitosa a la base de datos");
        } catch (error) {
            throw new Error(`Hubo un error ${error}`)
        }
    }

    async disconnect(){
        try {
            await this.client.connection.close();
            console.log("Base de datos desconectada");
        } catch (error) {
            throw new Error(`Hubo un error ${error}`)
        }
    }
}

export {MyMongoClient}
