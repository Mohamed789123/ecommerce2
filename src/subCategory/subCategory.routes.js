import { Router } from "express";
import * as SC from "./subCategory.controller.js"
import * as SV from "./subCategory.validation.js"
import { multerHost, filtration } from "../../middleware/multer.js"
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemroles.js";
import validation from "../../middleware/validation.js"

const router = Router()

router.post("/add", multerHost(filtration.image).single("image"),
    validation(SV.addSubCategoryValidation), auth([systemRoles.admin]),
    SC.addsubCategory)


router.put("/update/:id", multerHost(filtration.image).single("image"),
    validation(SV.updateSubCategoryValidation), auth([systemRoles.admin]),
    SC.updateSubCategory)

router.get("/", validation(SV.getSubCategoryValidation), auth(Object.values(systemRoles)), SC.getSubCategory)

router.delete("/delete/:id", validation(SV.deletesubCategoryvalidation), auth([systemRoles.admin]), SC.deleteSubCategory)






export default router