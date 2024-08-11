import { Router } from "express";
import * as CC from "./category.controller.js"
import * as CV from "./category.validation.js"
import { multerHost, filtration } from "../../middleware/multer.js"
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemroles.js";
import validation from "../../middleware/validation.js"
const router = Router()


router.post("/add", multerHost(filtration.image).single("image")
    , validation(CV.addCategoryValidation), auth([systemRoles.admin]), CC.addCategory)


router.put("/update/:id", multerHost(filtration.image).single("image"),
    validation(CV.updateCategoryValidation), auth([systemRoles.admin]), CC.updateCategory)

router.get("/", validation(CV.getCategoryValidation), auth(Object.values(systemRoles)), CC.getCategory)

router.delete("/delete/:id", validation(CV.deleteCategoryValidation), auth([systemRoles.admin]), CC.deleteCategory)





export default router