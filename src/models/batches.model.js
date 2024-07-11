import mongoose, { Schema } from "mongoose";
// import { Branch } from "./branch.model";

const batchSchema = new Schema(
    {
        batchName: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        status: {
            type: Boolean,
            required: true,
        },
        branch: {
            type: Schema.Types.ObjectId,
            ref: "Branch"
        },
        students: [
            {
                type: Schema.Types.ObjectId,
                ref: "Student"
            }
        ]
    },
    {timestamps: true}
)

export const Batch = mongoose.model("Batch", batchSchema)