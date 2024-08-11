import { Router } from "express";
import * as CC from "./coupon.controller.js"
import * as CV from "./coupon.validation.js"
import { multerHost, filtration } from "../../middleware/multer.js"
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemroles.js";
import validation from "../../middleware/validation.js"
const router = Router()

router.post("/add", validation(CV.addCouponValidation), auth([systemRoles.admin]), CC.addCoupon)

router.put("/:id", validation(CV.updateCouponValidation), auth([systemRoles.admin]), CC.updateCoupon)










export default router