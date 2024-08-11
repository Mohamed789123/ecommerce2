import { Router } from "express";
import * as PC from "./product.controller.js"
import * as PV from "./product.validation.js"
import { multerHost, filtration } from "../../middleware/multer.js"
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemroles.js";
import validation from "../../middleware/validation.js"
import reviewRouter from "../review/review.routes.js"
import wishlistRouter from "../wishList/wishList.routes.js"
const router = Router()

router.use("/:productId/review", reviewRouter)
router.use("/:productId/wishlist", wishlistRouter)

router.post("/add", multerHost(filtration.image).fields([
    { name: "image", maxCount: 1 },
    { name: "coverImages", maxCount: 3 },
]),
    validation(PV.addProductValidation), auth([systemRoles.admin]), PC.addProduct)



router.put("/update/:id",
    multerHost(filtration.image).fields([
        { name: "image", maxCount: 1 },
        { name: "coverImages", maxCount: 3 }
    ]),
    validation(PV.updateProductValidation), auth([systemRoles.admin]), PC.updateProduct)





router.get("/", PC.getProduct)








export default router