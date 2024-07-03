import dotenv from 'dotenv'
import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

dotenv.config({
    path: './.env'
})

const cloudName = process.env.COUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

// console.table([cloudName, apiKey, apiSecret])

cloudinary.config({ 
  cloud_name: cloudName, 
  api_key: apiKey,
  api_secret: apiSecret
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // console.log("File is uploaded successfully", response.url);
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)
        // console.log("cloudinary catch error: ", error);
        return null;
    }
}

export { uploadOnCloudinary }