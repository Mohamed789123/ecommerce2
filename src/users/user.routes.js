import { Router } from "express";
import * as UC from "./user.controller.js"
import * as UV from "./user.validation.js"
import { multerHost, filtration } from "../../middleware/multer.js"
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemroles.js";
import validation from "../../middleware/validation.js";

const router = Router()

router.post("/signup", validation(UV.signUpValidation), UC.signUp)
router.get("/confirmEmail/:token", validation(UV.confirmEmail), UC.confirmEmail)
router.get("/reconfirmEmail/:reftoken", validation(UV.reconfirmEmail), UC.refConfirmEmail)
router.get("/signin", validation(UV.signInValidation), UC.signIn)
router.put("/sendcode", validation(UV.forgetPassword), UC.forgetPassword)
router.put("/resetpassword", validation(UV.resetpassword), UC.resetPassword)
router.get("/profile", validation(UV.getProfileValidation), auth([systemRoles.admin]), UC.getData)
router.delete("/delete", validation(UV.deleteUserValidation), auth([systemRoles.admin]), UC.deleteUser)
export default router