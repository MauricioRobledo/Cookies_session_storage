const express = require('express');
const options = require("./config/dbConfig");
const {productsRouter, products} = require('./routes/products');
const handlebars = require('express-handlebars');
const {Server} = require("socket.io");
const {normalize, schema} = require("normalizr");
const {faker} = require("@faker-js/faker")
const Contenedor = require("./managers/contenedorProductos");
const ContenedorChat = require('./managers/contenedorChat');
const ContenedorSql = require("./managers/contenedorSql");
const session = require('express-session');
const cookieParser = require("cookie-parser")
const mongoStore = require ("connect-mongo")

const {commerce, image} = faker
//service
// const productosApi = new Contenedor("productos.txt");
const productosApi = new ContenedorSql(options.mariaDB, "products");
const chatApi = new ContenedorChat("chat.txt");
// const chatApi = new ContenedorSql(options.sqliteDB,"chat");

//server
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))

//configuracion template engine handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');

//normalizacion
//creamos los esquemas.
//esquema del author
const authorSchema = new schema.Entity("authors",{}, {idAttribute:"email"});

//esquema mensaje
const messageSchema = new schema.Entity("messages", {author: authorSchema});

//creamos nuevo objeto para normalizar la informacion
// {
//     id:"chatHistory",
//     messages:[
//         {},{},{}
//     ]
// }
//esquema global para el nuevo objeto
const chatSchema = new schema.Entity("chat", {
    messages:[messageSchema]
}, {idAttribute:"id"});

//aplicar la normalizacion
//crear una funcion que la podemos llamar para normalizar la data
const normalizarData = (data)=>{
    const normalizeData = normalize({id:"chatHistory", messages:data}, chatSchema);
    return normalizeData;
};

const normalizarMensajes = async()=>{
    const results = await chatApi.getAll();
    const messagesNormalized = normalizarData(results);
    // console.log(JSON.stringify(messagesNormalized, null,"\t"));
    return messagesNormalized;
}

const randomProducts = ()=>{
    let products = []
    for(let i=0;i<5;i++){
        products.push({
            title:commerce.product(),
            price:commerce.price(),
            thumbnail:image.imageUrl()
        })
    }
    return products
}
const calcularPorcentaje = async()=>{
    const chat = await chatApi.getAll()
    const normal = await normalizarMensajes()
    const result = 100 - Math.round((JSON.stringify(normal).length / JSON.stringify(chat).length) * 100)
    console.log(JSON.stringify(chat).length,JSON.stringify(normal).length)
    return result
}



app.use(session({
    store: mongoStore.create({
        mongoUrl:"mongodb+srv://Nicolas:coder1234@coderbackend.bppuxoq.mongodb.net/sessionsDB?retryWrites=true&w=majority"
    }),
    secret: "claveSecreta",
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge:600000
    }
}))

// Verificar login
const checkUserLogged = (req,res,next)=>{
    if(req.session.username){
        next();
    } else{
        res.redirect("/login");
    }
}

// routes
//view routes
app.get('/', checkUserLogged, async(req,res)=>{
    res.render('home',{username: req.session.username,
        porcentaje: await calcularPorcentaje()})
})

app.get('/productos', checkUserLogged, async(req,res)=>{
    res.render('products',{products: await productosApi.getAll()})
})

app.get("/api/productos-test",checkUserLogged, async(req,res)=>{
    res.render('products',{
        products: randomProducts()
    })
})

// Login
app.use(cookieParser())

//api routes
app.use('/api/products',productsRouter)

app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login",(req,res)=>{
    const user = req.body
    console.log(user)
    req.session.username = user.username
    res.redirect("/")
});


app.get("/logout",(req,res)=>{
    const username = req.session.username
    req.session.destroy()
    res.redirect("/login")
})

//express server
const server = app.listen(8080,()=>{
    console.log('listening on port 8080')
})







//websocket server
const io = new Server(server);

//configuracion websocket
io.on("connection",async(socket)=>{
    //PRODUCTOS
    //envio de los productos al socket que se conecta.
    io.sockets.emit("products", await productosApi.getAll())

    //recibimos el producto nuevo del cliente y lo guardamos con filesystem
    socket.on("newProduct",async(data)=>{
        await productosApi.save(data);
        //despues de guardar un nuevo producto, enviamos el listado de productos actualizado a todos los sockets conectados
        io.sockets.emit("products", await productosApi.getAll())
    })

    //CHAT
    //Envio de todos los mensajes al socket que se conecta.
    io.sockets.emit("messages", await normalizarMensajes());

    //recibimos el mensaje del usuario y lo guardamos en el archivo chat.txt
    socket.on("newMessage", async(newMsg)=>{
        console.log(newMsg);
        await chatApi.save(newMsg);
        io.sockets.emit("messages", await normalizarMensajes());
    });
})