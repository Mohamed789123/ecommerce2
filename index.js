import dotenv from "dotenv"
dotenv.config()
import express from "express"
import globalErrorHandling from "./utils/globalErrorHandling.js"
import AppError from "./utils/classError.js"
import connectiondb from "./db/connectiondb.js"
import userRouter from "./src/users/user.routes.js"
import categoryRouter from "./src/category/category.routes.js"
import subCategoryRouter from "./src/subCategory/subCategory.routes.js"
import brandRouter from "./src/brands/brans.routes.js"
import productRouter from "./src/product/product.routes.js"
import couponRouter from "./src/coupon/coupon.routes.js"
import cartRouter from "./src/cart/cart.routes.js"
import orderRouter from "./src/order/order.routes.js"
import reviewRouter from "./src/review/review.routes.js"
import wishlistRouter from "./src/wishList/wishList.routes.js"
import { deleteFromCloudinary } from "./utils/deleteFromCloudinary.js"
import { deleteFromDb } from "./utils/deleteFromDb.js"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())
connectiondb()

const port = process.env.PORT || 5000




app.use("/users", userRouter)
app.use("/category", categoryRouter)
app.use("/subCategory", subCategoryRouter)
app.use("/brands", brandRouter)
app.use("/product", productRouter)
app.use("/coupon", couponRouter)
app.use("/cart", cartRouter)
app.use("/order", orderRouter)
app.use("/review", reviewRouter)
app.use("/wishlist", wishlistRouter)



app.get("/", (req, res, next) => {
    res.status(200).json({ msg: "hello in my project" })
})

app.use(globalErrorHandling, deleteFromCloudinary, deleteFromDb)




app.use("*", (req, res, next) => {
    return next(new AppError("404 page not found"))
})
app.listen(port, () => {
    console.log("server is running on port 5000")
})
