import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Student } from "../models/student.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const create = asyncHandler(async(req, res) => {
    const {name, email, mobileNo, course} = req.body
    const {branchId} = req.params;

    console.log(name, email, mobileNo, course, branchId);

    if (!name || !email || !mobileNo || !course) {
        throw new  ApiError(400, "All fields are required")
    }

    const create =  await Student.create({
        name,
        email,
        mobileNo,
        course,
        branchName: req?.user?._id || branchId
    })

    if (!create) {
        throw new ApiError(400, "unable to create students")
    }
    
    return res
    .status(200)
    .json(new ApiResponse(200, create, "Student created successfully"))
    
})

const getAllBranchStudents = asyncHandler(async(req, res) => {
    const {branchId} = req.params;
    // console.log(req?.user?._id, branchId);

    const students = await Student.find({branchName: req?.user?._id || branchId})
    // console.log(req?.user?._id, branchId);

    if (!students) {
        throw new ApiError(400, "no students found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, students, "Students found successfully"))
})

const removeStudent = asyncHandler(async(req, res) => {
    const {studentId} = req.params;
    
    if (!studentId) {
        throw new ApiError(400, "Student Id is not found")
    }

    const remove = await Student.findByIdAndDelete(studentId)

    if (!remove) {
        throw new ApiError(400, "Unable to delete this student")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, remove , "Student deleted successfully"))
})


export {
    create,
    getAllBranchStudents,
    removeStudent,
}