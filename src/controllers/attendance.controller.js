import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Attendance } from "../models/attendance.js";

import { asyncHandler } from "../utils/asyncHandler.js";

const createAttendance = asyncHandler(async(req, res) => {
    const { studentId, batchId } = req.params;
    const { date, status } = req.body;

    // console.log("this is student branch", studentId, batchId );

    if(!studentId || !date || !status || !batchId) {
        throw new ApiError(400, "All fields are required")
    }

    const record = await Attendance.findOne({ studentId, batchId })

    if (record) {
        const existingRecord = record.attendance.find((data) => data.date === date);

        if (existingRecord) {
            // Update the status of the existing record
            existingRecord.status = status;
        } else {
            // If no record exists for the given date, add the new attendance record
            record.attendance.push({ date, status });
        }

        await record.save();

        return res
        .status(200)
        .json(new ApiResponse(200, record, "Attendance updated successfully"));

    } else {
        const attendance = await Attendance.create({
            studentId,
            batchId,
            attendance: [{date, status}]
        })

        return res
        .status(200)
        .json(new ApiResponse(200, attendance, "Attendance created successfully"))
    }

})

const getAttendance = asyncHandler(async(req, res) => {
    const { studentId, batchId } = req.params;
    const {month=7, year=2023} = req.query;

    const months = parseInt(month)
    const years = parseInt(year)

    // console.log("this is month", months, years);

    if (!studentId || !batchId) {
        throw new ApiError(400, "studentId or BranchId is not found")
    }


    const attendance = await Attendance.findOne({ studentId, batchId })

    // console.log(attendance?.attendance);


    let array = [];

    for (let index = 1; index <= 31; index++) {
        const exist = attendance?.attendance?.find(data => {
            const day = parseInt(data.date.slice(5, 7));
            const month = parseInt(data.date.slice(8, 10));
            const year = parseInt(data.date.slice(0, 4));
            return (day === index) && (month === months) && (year === years);
        });

        if (exist) {
            array.push(exist);
        } else {
            array.push({ date: `${years}-${String(index).padStart(2, '0')}-${String(months).padStart(2, '0')}`, status: null }); // Placeholder with default status
        }

    }


    return res
    .status(200)
    .json(new ApiResponse(200, array, "Attendance fetched successfully"));

})

const getAttByBatch = asyncHandler(async(req, res) => {
    const { studentId, batchId } = req.params;
    const {date} = req.body;

    // console.log(date, studentId, batchId);

    if (!studentId || !batchId || !date) {
        throw new ApiError(400, "all fields are required")
    }

    const attendance = await Attendance.findOne({ studentId, batchId })
    // console.log(attendance?.attendance);

    if (attendance) {
        const exist = attendance?.attendance?.find(data => {
            const dates = data.date;
            return (date === dates);
        });

        // console.log("this is exist", exist);
        return res
        .status(200)
        .json(new ApiResponse(200, exist?.status || null, "Attendance fetched successfully"));
    } else {
        return res
        .status(200)
        .json(new ApiResponse(200, null, "Attendance fetched successfully"));
    }

})


export {
    createAttendance,
    getAttendance,
    getAttByBatch
}