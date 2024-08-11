import { Router } from "express";
import * as BC from "./brand.controller.js"
import * as BV from "./brand.validation.js"
import { multerHost, filtration } from "../../middleware/multer.js"
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemroles.js";
import validation from "../../middleware/validation.js"
const router = Router()

router.post("/add", multerHost(filtration.image).single("image"),
    validation(BV.addBrandValidation),
    auth([systemRoles.admin]), BC.addBrand)


router.get("/:name", validation(BV.getBrand), auth([systemRoles.admin]), BC.getBrands)

router.put("/update/:id", multerHost(filtration.image).single("image"),
    validation(BV.updateBrandValidation), auth([systemRoles.admin]), BC.updateBrands)

router.delete("/delete/:id", validation(BV.deleteBrandvalidation), auth([systemRoles.admin]), BC.deletebrand)




export default router