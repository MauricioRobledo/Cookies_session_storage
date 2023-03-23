import express from 'express';
import passport from "passport"
import {Strategy as localStrategy} from "passport-local"
import bcrypt from "bcrypt"
import { UserModel } from '../../models/dbModels/modelUser.js'
import { agregarAvatar } from '../../services/avatar.service.js';
import fs from "fs"


const router = express.Router();
router.use(passport.initialize())
router.use(passport.session())

//Seteo del passport para poder validar el signup y login

passport.serializeUser((user,done)=>{
    done(null, user.id)
});


passport.deserializeUser((id,done)=>{
    UserModel.findById(id,(err, userFound)=>{
        return done(err, userFound)
    })
});

const createHash = (password)=>{
    const hash = bcrypt.hashSync(password,bcrypt.genSaltSync(10));
    return hash;
}

passport.use("signupStrategy", new localStrategy(
    {
        passReqToCallback: true,
        usernameField: "email",
    },
    (req,username,password,done)=>{
        UserModel.findOne({username:username},(error,userFound)=>{
            if(error) return done(error,null,{message:"Hubo un error"})
            if(userFound) return done(null,null,{message:"El usuario ya existe"})
            const newUser ={
                name:req.body.name,
                adress:req.body.adress,
                age:req.body.age,
                phone:req.body.phone,
                username:username,
                password:createHash(password),
                picture:req.body.picture
            }
            UserModel.create(newUser,(error, userCreated)=>{
                if(error) return done(error,null,{message:"Error al registrar el usuario"})
                return done(null,userCreated)
            })
        })
    }
))

passport.use("loginStrategy", new localStrategy(
    {
        usernameField: "email"
    },
    (username,password,done)=>{
        UserModel.findOne({username:username},(error,userFound)=>{
            if(error) return done(error,null,{message:"Hubo un error"})
            if (!userFound) return done(null,null,{message:"Error este usuario no existe"})
            const igual = bcrypt.compareSync(password, userFound.password)
            if(!igual){
                return done(null,null,{message:"Contraseña incorrecta"})
            }
            return done(null,userFound)
        })
    }
))



router.get('/', async(req,res)=>{
    // Renderiza la ruta home y obtiene la foto de perfil del usuario 
    if(req.isAuthenticated()){
        const contenido = await fs.promises.readFile("./src/public/avatars/avatar.txt","utf8");
        const avatars = JSON.parse(contenido);
        const userAvatar = avatars.find(item=>item.id===req.session.passport.user)
        const icon = userAvatar.avatar
        res.render('home', {icon})
    } else{
        res.send("<div>Debes <a href='/login'>inciar sesion</a> o <a href='/signup'>registrarte</a></div>")
    }
})


router.get("/signup", (req, res)=>{
    const errorMessage = req.session.messages ? req.session.messages[0] : '';
    res.render("signup", {error:errorMessage});
    req.session.messages = [];
})

router.get("/login",(req,res)=>{
    const errorMessage = req.session.messages ? req.session.messages[0] : '';
    res.render("login", {error:errorMessage});
    req.session.messages = [];
})

router.post("/signup",passport.authenticate("signupStrategy",{
    failureRedirect:"/signup",
    failureMessage:true
}),async(req,res)=>{
    const userAvatar = req.body.picture
    const userId = req.session.passport.user
    agregarAvatar(userId, userAvatar)
    res.redirect("/")
})

router.post("/login",passport.authenticate("loginStrategy",{
    successRedirect:"/",
    failureRedirect:"/login",
    failureMessage:true
}))


router.get("/logout",(req,res)=>{
    req.session.destroy()
    res.redirect("/login")
})

export {router as viewsRouter}