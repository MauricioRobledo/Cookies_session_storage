import * as dotenv from "dotenv"

dotenv.config()

export const config = {
    mongoUrlSessions: process.env.mongoUrlSessions,
    mongoUrl: process.env.mongoUrl,
    clave: process.env.clave,
    cluster: process.env.cluster,
    email: process.env.email,
    number: process.env.number,
    twillioAccountId: process.env.twillioAccountId,
    twillioAuthToken: process.env.twillioAuthToken,
    nodemailerPassword: process.env.nodemailerPassword
}