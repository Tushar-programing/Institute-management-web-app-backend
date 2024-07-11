import {Router} from "express";
import { verifyJWT } from "../middlewares/authmiddlewares.js";
import { createAttendance, getAttByBatch, getAttendance } from "../controllers/attendance.controller.js";

const router = Router()

router.route("/createAttendance/:studentId/:batchId").post(verifyJWT, createAttendance)

router.route("/getAttendance/:studentId/:batchId").post(verifyJWT, getAttendance)

router.route("/getAttByBatch/:studentId/:batchId").post(verifyJWT, getAttByBatch)


export default router