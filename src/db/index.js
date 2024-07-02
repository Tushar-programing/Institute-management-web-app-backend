import { DB_NAME } from "../constants.js";
import mongoose from "mongoose";

// console.log(process.env.PORT);

const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(error);
    }
}

export default connectDB