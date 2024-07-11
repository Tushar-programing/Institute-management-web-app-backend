import mongoose, { Schema } from "mongoose";


const attendanceSchema = new Schema(
    {
        studentId: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
        },
        batchId: {
            type: Schema.Types.ObjectId,
            ref: 'Branch',
        },
        attendance: [
            { date: {type: String,}, status: {type: String,}, _id: false, },
        ]
    },
    {timestamps: true}
)

export const Attendance = mongoose.model("Attendance", attendanceSchema)