import { Router } from "express";
import * as CC from "./cart.controller.js"
import * as CV from "./cart.validation.js"
import { multerHost, filtration } from "../../middleware/multer.js"
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemroles.js";
import validation from "../../middleware/validation.js"
const router = Router()

router.post("/add", validation(CV.addCartValidation), auth(Object.values(systemRoles)), CC.addCart)

router.put("/remove", validation(CV.removeCartValidation), auth(Object.values(systemRoles)), CC.removeCart)

router.put("/clear", validation(CV.clearCartValidation), auth(Object.values(systemRoles)), CC.clearCart)



export default router