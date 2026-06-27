import "reflect-metadata";

import fastify from "fastify"
import env from "dotenv"
import { connectionDb } from "./infrastructure/database/connection" 
import { couponRoutes } from "./http/routes/counpon.routes";

env.config()

const app = fastify()

app.register(couponRoutes);

const port = parseInt(process.env.PORT) || 3000
const host = process.env.HOST || "localhost"

app.listen({port,host},async ()=>{
    try{

    await connectionDb.initialize()
    console.log(`servidor iniciado http://${host}:${port}`)        
    }
    catch(error){
    console.log(error)
    }

})