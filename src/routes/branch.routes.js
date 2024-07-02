import {Router} from "express";
import { verifyJWT } from "../middlewares/authmiddlewares.js";
import { getAllBranchInfo, getCurrentUser, loginBranch, registerBranch } from "../controllers/branch.controller.js";

const router = Router()

router.route("/registerBranch").post(registerBranch)

router.route("/loginBranch").post(loginBranch)

router.route("/getCurrentUser").post(verifyJWT, getCurrentUser)

router.route("/getAllBranchInfo").post(verifyJWT, getAllBranchInfo)


export default router