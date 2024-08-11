import { Router } from "express";
import * as RC from "./review.controller.js"
import * as RV from "./review.validation.js"
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemroles.js";
import validation from "../../middleware/validation.js"
const router = Router({ mergeParams: true })


router.post("/", validation(RV.addReviewValidation), auth([systemRoles.admin]), RC.addReview)

router.delete("/:id", validation(RV.deleteReviewValidation), auth([systemRoles.admin]), RC.deleteReview)







export default router