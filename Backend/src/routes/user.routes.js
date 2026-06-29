import express from "express"
import { register , verify , reVerify , login, logout, forgetPassword, verifyOTP, changePassword, allUser, getUserById} from "../controllers/user.controller.js"
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js"

const router = express.Router()

router.post("/register" , register)
router.post("/verify" , verify)
router.post("/reVerify" , reVerify)
router.post("/login" , login)
router.post("/logout", isAuthenticated , logout)
router.post("/forget-password", forgetPassword)
router.post("/verify-otp/:email", verifyOTP)
router.post("/change-password/:email", changePassword)
router.get("/get-allUser" , isAuthenticated , isAdmin , allUser)
router.get("/get-user/:userId" , getUserById)

export default router;