import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import jwt from "jsonwebtoken";
import { Branch } from "../models/branch.model.js";

export const verifyJWT = asyncHandler( async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(402, "402 Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)


        const user = await Branch.findById(decodedToken.id).select("-password -refreshToken")


        if (!user) {
            throw new ApiError(400, "Invalid access Token")
        }


        if (user?.userName === "admin") {
            // console.log("admin", user);
            req.admin = user

            next()
        }else {
            // console.log("user", user);
            req.user = user
        
            next()
        }

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})
