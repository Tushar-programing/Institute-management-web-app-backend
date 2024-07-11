import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
dotenv.config({
    path: './.env'
})

import { ApiError } from "./utils/apiError.js"

const app = express()
console.log(process.env.CORS_ORIGIN);

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import branch from "./routes/branch.routes.js"
import student from "./routes/student.routes.js"
import batches from "./routes/batches.routes.js"
import attendance from "./routes/attendance.routes.js"

app.use("/api/v1/branch", branch)
app.use("/api/v1/student", student)
app.use("/api/v1/batches", batches)
app.use("/api/v1/attendance", attendance)

// app.use((err, req, res, next) => {
//     if (err instanceof ApiError) {
  
//     //   console.log(err.message)
//       return res.status(err.statusCode).json({
//         statusCode: err.statusCode,
//         message: err.message,
//         success: false
  
//       });
//     }
//     // console.log(err)
//     return res.status(500).json({
//       success: false,
//       message: 'Something went wrong on the server',
//     });
//   });



export {app}