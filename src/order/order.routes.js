import { Router } from "express";
import * as OC from "./order.controller.js"
import * as OV from "./order.validation.js"
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemroles.js";
import validation from "../../middleware/validation.js"
const router = Router()

router.post("/add", validation(OV.addOrderValidation), auth(Object.values(systemRoles)), OC.addOrder)

router.put("/:id", validation(OV.cancelOrderValidation), auth(Object.values(systemRoles)), OC.cancelOrder)










export default router