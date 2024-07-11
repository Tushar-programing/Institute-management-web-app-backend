import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Batch } from "../models/batches.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const create = asyncHandler(async(req, res) => {
    const { batchName, startDate, endDate, status } = req.body;
    const {branchId} = req.params;

    if (!batchName || !startDate || !status || !endDate) {
        throw new ApiError(400, "All fields are required")
    }
    
    const exist = await Batch.findOne({batchName})

    if (exist) {
        throw new ApiError(400, "batch exist with this name")
    }

    const batch = await Batch.create(
        { 
            batchName,
            startDate,
            endDate,
            status,
            branch: req?.user?._id || branchId
        }
    );

    if (!batch) {
        throw new ApiError(400, "unable to create branch")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, batch, "batch created succesfully"));

})

const update = asyncHandler(async(req, res) => {
    const {batchId} = req.params;

    const {batchName, startDate, endDate, status} = req.body;

    console.log(batchName, startDate, endDate, status, batchId);

    if (!batchName || !startDate || !endDate || !status || !batchId) {
        throw new ApiError(400, "All fields are required")
    }

    const update = await Batch.findByIdAndUpdate(
        batchId,
        {
            $set: {
                batchName,
                startDate,
                endDate,
                status
            }
        },
        {new: true}
    )

    if (!update) {
        throw new ApiError(400, "Unable to update batch")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, update, "batch updated successfully"));

})

const remove = asyncHandler(async(req, res) => {
    const {batchId} = req.params;

    if (!batchId) {
        throw new ApiError(400, "Batch Id is required")
    }

    const remove = await Batch.findByIdAndDelete(batchId)

    if (!remove) {
        throw new ApiError(400, "Unable to remove Batches")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, remove, "Batch removed successfully"));

})


const addStudent = asyncHandler(async(req, res) => {
    const {batchId} = req.params;
    const { studentId } = req.body;

    if (!batchId || !studentId) {
        throw new ApiError(400, "batchID or StudentID is required")
    }

    const batch = await Batch.findById(batchId)

    if (!batch) {
        throw new ApiError(400, "Batch Id is required")
    }

    const exist =  batch.students.includes(studentId)
    // const exists = playlist.videos.includes(videoId);

    if (exist) {
        throw new ApiError(400, "This student is already available")
    }

    batch.students.push(studentId)

    await batch.save();

    return res
    .status(200)
    .json(new ApiResponse(200, batch, "student added successfully"));

})

const removeStudent = asyncHandler(async(req, res) => {
    const {batchId} = req.params;
    const { studentId } = req.body;

    if (!batchId || !studentId) {
        throw new ApiError(400, "batchID or StudentID is required")
    }

    const batch = await Batch.findById(batchId)

    if (!batch) {
        throw new ApiError(400, "Batch Id is required")
    }

    const exist =  batch.students.includes(studentId)
    // const exists = playlist.videos.includes(videoId);

    if (!exist) {
        throw new ApiError(400, "This student is not exist")
    }

    batch.students = batch.students.filter(student => student.toString() !== studentId);

    await batch.save();

    return res
    .status(200)
    .json(new ApiResponse(200, batch, "student removed successfully"));

})

const getAllBatches = asyncHandler(async (req, res) => {
    const { branchId } = req.params;

    const matchCondition = req?.user?._id ? { branch: new mongoose.Types.ObjectId(req.user._id) } : { branch: new mongoose.Types.ObjectId(branchId) };

    const batches = await Batch.aggregate([
        {
            $match: matchCondition
        },
        {
            $lookup: {
                from: "students",
                localField: "students",
                foreignField: "_id", 
                as: "studentsDetails",
                pipeline: [
                    {
                        $project: {
                            branchName: 0,
                            updatedAt: 0,
                            createdAt: 0,
                        }
                    }
                ]
            }
        },
        {
            $project: {
                students: 0,
            }
        },
    ]);

    if (!batches) {
        throw new ApiError(400, "unable to create batches")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, batches, "batches fetched successfully"));

});





export { 
    create,
    update,
    remove,
    addStudent,
    removeStudent,
    getAllBatches,
}