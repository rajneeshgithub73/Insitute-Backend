import dotenv from 'dotenv'
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectDB } from './db/connectDB.js';

dotenv.config({
    path: './.env'
})

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())

app.use(express.urlencoded({
    extended: true
}))

app.use(express.static("public"))

app.use(cookieParser())

// route import

import studentRouter from './routes/student.routes.js'

// route declaration

app.get('/', (req, res) => {
    res.send('hello world')
})

app.use('/api/v1/student', studentRouter)

connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is listening on port :${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MONGODB connection failed: ", err)
})