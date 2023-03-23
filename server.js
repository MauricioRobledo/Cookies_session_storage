import express from 'express';
import { apiRouter } from './routes/index.js';
import handlebars from 'express-handlebars';
import path from 'path';
import { fileURLToPath} from "url";
import {config} from "./config/config.js"
import os from "os"
import cluster from 'cluster';




const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))

//configuracion template engine handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');



//api routes
app.use("/", apiRouter)


//Permite ejecutar el servidor en modo Cluster
const MODO = config.cluster
if(MODO === "CLUSTER" && cluster.isPrimary){
    const numCPUS = os.cpus().length
    for(let i=0; i<numCPUS; i++){
        cluster.fork()
    }
    cluster.on("exit",(worker)=>{
        console.log (`El subproceso ${worker.process.pid} fallo`)
        cluster.fork()
    })
}else{
    //express server
    const PORT = process.env.PORT || 8080
    const server = app.listen(PORT,()=>{
        console.log(`Escuchando en puerto ${PORT}`)
    })



}