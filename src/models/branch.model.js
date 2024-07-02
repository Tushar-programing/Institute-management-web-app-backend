import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const branchSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
        }
    },
    {timestamps: true}
)

branchSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next();
})

branchSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}

branchSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            id: this._id,
            userName: this.userName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}


branchSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            id: this._id,
            userName: this.userName
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}


export const Branch = mongoose.model("Branch", branchSchema)
