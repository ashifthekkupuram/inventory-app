import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url';

import itemRouter from './routes/itemRouter.js'
import categoryRouter from './routes/categoryRouter.js'

import errorHandler from './middlewares/errorHandler.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB = process.env.MONGODB_CLUSTER_URI

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, "public")));

mongoose.set("strictQuery", false);

const ConnectDB = async () =>{
    try{
        await mongoose.connect(DB)
        console.log('DB Connected!')
    }catch(error){
        console.log(error)
    }
}
ConnectDB()

app.get('/', (req,res)=>{
    res.redirect('/item')
})

app.use('/item',itemRouter)
app.use('/category',categoryRouter)

app.use(errorHandler)

app.listen(5000,()=>{
    console.log('app is running...')
})