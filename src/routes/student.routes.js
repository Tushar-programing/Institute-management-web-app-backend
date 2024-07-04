import { Router } from "express";
import { verifyJWT } from "../middlewares/authmiddlewares.js";
import { create, getAllBranchStudents, removeStudent } from "../controllers/student.controllers.js";

const router = Router()

router.route("/create/:branchId").post(verifyJWT, create)

router.route("/getAllBranchStudents/:branchId").post(verifyJWT, getAllBranchStudents)

router.route("/removeStudent/:studentId").post(verifyJWT, removeStudent)


export default router