import {Router} from "express";
import { verifyJWT } from "../middlewares/authmiddlewares.js";
import { addStudent, create, getAllBatches, remove, removeStudent, update } from "../controllers/batches.controllers.js";

const router = Router()

router.route("/create/:branchId").post(verifyJWT, create)

router.route("/update/:batchId").post(verifyJWT, update)

router.route("/remove/:batchId").post(verifyJWT, remove)

router.route("/addStudent/:batchId").post(verifyJWT, addStudent)

router.route("/removeStudent/:batchId").post(verifyJWT, removeStudent)

router.route("/getAllBatches/:branchId").post(verifyJWT, getAllBatches)


export default router