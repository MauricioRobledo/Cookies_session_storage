import express from "express"
import session  from 'express-session';
import cookieParser from "cookie-parser"
import mongoStore from "connect-mongo";
import { config } from "../../config/config.js";

const router = express.Router();

router.use(session({
    store: mongoStore.create({
        mongoUrl: config.mongoUrlSessions
    }),
    secret: config.clave,
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge:600000
    }
}))

router.use(cookieParser())

export {router as sessionRouter}