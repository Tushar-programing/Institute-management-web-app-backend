import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        mobileNo: {
            type: String,
            required: true,
        },
        course: {
            type: String,
            required: true,
        },
        branchName: {
            type: Schema.Types.ObjectId,
            ref: "Branch"
        }
    },
    {timestamps: true}
)


export const Student = mongoose.model("Student", studentSchema)