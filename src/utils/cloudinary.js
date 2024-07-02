import fs from "fs"
import {v2 as cloudinary} from "cloudinary"
import { response } from "express"


const uploadOnCloudinary = async(localFilePath) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET,
    })
    // console.log(process.env.CLOUDINARY_CLOUD_NAME,
    //     process.env.CLOUDINARY_API_KEY, 
    //     process.env.CLOUDINARY_API_SECRET,);

    try {
        if (localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "e-commerce"
        })

        fs.unlinkSync(localFilePath)
        return response

    } catch (error) {
        console.log(error);
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

export {uploadOnCloudinary}