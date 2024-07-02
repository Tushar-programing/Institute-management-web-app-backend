import { Branch } from "../models/branch.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";


const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const branch = await Branch.findById(userId)
        const accessToken = branch.generateAccessToken()
        const refreshToken = branch.generateRefreshToken();

        branch.refreshToken = refreshToken;
        await branch.save({ validateBeforeSave: false })
        
        return {accessToken, refreshToken}

    } catch (error) {
        console.log(error);
    }
}

const registerBranch = asyncHandler(async(req, res) => {

    const {userName, password} = req.body;

    if (!userName || !password) {
        throw new ApiError(400, "All fields are required")
    }

    const exist = await Branch.findOne({userName})

    if (exist) {
        throw new ApiError(400, "This branch name is already exist !")
    }

    const create = await Branch.create({
        userName,
        password
    })

    if (!create) {
        throw new ApiError(400, "unable to register the branch")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, create, "branch register successfully"))
})

const loginBranch = asyncHandler(async(req, res) => {
    const {userName, password} = req.body;

    console.log(userName, password);

    if (!userName || !password) {
        throw new ApiError(400, "all fields are required")
    }

    const branch  = await Branch.findOne({userName})

    if (!branch) {
        throw new ApiError(400, "Branch does not exist with this Branch Name")
    }

    const isPasswordCorrect = await branch.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "your password is incorrect")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(branch._id)

    const loggedInUser = await Branch.findById(branch._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, 
        {
            branch: loggedInUser, accessToken, refreshToken
        },
        "branch logged in successfully"
    ))
})

const getCurrentUser = asyncHandler(async(req, res) => {
    // let user;

    if (req.user) {
        const user = req.user
        return res
        .status(200)
        .json(new ApiResponse(200, user, "User fetched successfully"))
    } else if (req.admin) {
        const user = req.admin 
        return res
        .status(200)
        .json(new ApiResponse(200, user, "User fetched successfully"))
    }

    // return res
    // .status(200)
    // .json(new ApiResponse(200, user, "User fetched successfully"))
})


const getAllBranchInfo = asyncHandler(async(req, res) => {

    if (req.admin) {
        const branches = await Branch.find().select("-password -refreshToken")
        if (branches.length < 0) {
            throw new ApiError(400, "No branch register yet")
        }

        const branch = branches.filter((doc) => doc.userName !== "admin")

        return res
        .status(200)
        .json(new ApiResponse(200, branch, "All Branches fetched successfully"))
    } else if(req.user) {
        const branch = await Branch.find({_id: req.user._id}).select("-password -refreshToken")

        return res
        .status(200)
        .json(new ApiResponse(200, branch, "Branch fetched successfully"))
    }
})




export {
    registerBranch,
    loginBranch,
    getCurrentUser,
    getAllBranchInfo,
}
