import { Router } from "express";
import * as WV from "./wishList.validation.js"
import * as WC from "./wishList.controller.js"
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemroles.js";
import validation from "../../middleware/validation.js"

const router = Router({ mergeParams: true })


router.post("/", validation(WV.addWishListValidation), auth([systemRoles.admin]), WC.addWishList)










export default router