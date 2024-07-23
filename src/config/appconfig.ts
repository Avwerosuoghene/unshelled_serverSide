import dotenv from "dotenv";
import { IConfigurables } from "../database/types/models";

dotenv.config({ path: `${process.env.NODE_ENV}.env` });



export  const configuration : IConfigurables  = {
    dev: {
        mongoUrl: process.env.MONGO_URL_DEV!,
        jwtSecret: process.env.JWT_SECRET_DEV!,
        port: process.env.PORT_DEV!,
    },
    prod: {
        mongoUrl: process.env.MONGO_URL_PROD!,
        jwtSecret: process.env.JWT_SECRET_DEV!,
        port: process.env.PORT_PROD!,
    }
}