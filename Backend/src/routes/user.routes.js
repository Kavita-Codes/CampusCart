import express from "express"
import { register , verify , reVerify , login} from "../controllers/user.controller.js"

const router = express.Router()

router.post("/register" , register)
router.post("/verify" , verify)
router.post("/reVerify" , reVerify)
router.post("/login" , login)

export default router;