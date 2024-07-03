import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"


export const connectDB = async() => {
    try {
        const mongoDBconnectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`connected to MONGODB, HOST: ${mongoDBconnectionInstance.connection.host}`)
    } catch (error) {
        console.log(`MONGODB connection error: `,error)
        process.exit(1)
    }
}