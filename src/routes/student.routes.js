import { Router } from "express";
import { verifyJWT } from "../middlewares/authmiddlewares.js";
import { create, getAllBranchStudents } from "../controllers/student.controllers.js";

const router = Router()

router.route("/create/:branchId").post(verifyJWT, create)

router.route("/getAllBranchStudents/:branchId").post(verifyJWT, getAllBranchStudents)


export default router