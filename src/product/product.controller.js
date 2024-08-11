import productModel from "../../db/models/proudct.model.js";
import AppError from "../../utils/classError.js";
import cloudinary from "../../utils/cloudinary.js"
import asynchandler from "../../utils/asyncHandler.js"
import { nanoid } from "nanoid";
import slugify from "slugify";
import categoryModel from "../../db/models/category.model.js"
import subCategoryModel from "../../db/models/subcategory.model.js"
import brandModel from "../../db/models/brand.model.js"
import { ApiFeatures } from "../../utils/apiFeatures.js"




export const addProduct = asynchandler(async (req, res, next) => {
    const { title, description, category, subCategory, brand, price, discount, stock } = req.body

    const categoryExist = await categoryModel.findById(category)
    if (!categoryExist) {
        return next(new AppError("category not exist", 400))
    }

    const subCategoryExist = await subCategoryModel.findById(subCategory)
    if (!subCategoryExist) {
        return next(new AppError("subCategory not exist", 400))
    }

    const brandExist = await brandModel.findById(brand)
    if (!brandExist) {
        return next(new AppError("brand not exist", 400))
    }

    const exist = await productModel.findOne({ title })
    if (exist) {
        return next(new AppError("Product title already exist", 400))
    }

    if (!req.files) {
        return next(new AppError("Please upload a product image", 400));
    }
    // console.log(req.file);
    // console.log(req.files);
    const subPrice = price - (price * (discount || 0) / 100)
    const customId = nanoid(5)
    let list = []

    for (const file of req.files.coverImages) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
            folder: `NoonApp/category/${categoryExist.customId}/subCategory/${subCategoryExist.customId}/products/${customId}`
        })
        list.push({ secure_url, public_id })
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: `NoonApp/category/${categoryExist.customId}/subCategory/${subCategoryExist.customId}/products/${customId}`
    })

    const product = await productModel.create({
        title,
        description,
        category,
        subCategory,
        brand,
        createdBy: req.user._id,
        price,
        discount,
        stock,
        image: { secure_url, public_id },
        coverImages: list,
        slug: slugify(title, {
            replacement: '_',
            lower: true,
        }),
        subPrice,
        customId
    })
    if (!product) {
        return next(new AppError("Failed to create product", 400))
    }
    return res.json({ msg: "done", product })
})









//=======================================================updateProduct======================================
export const updateProduct = asynchandler(async (req, res, next) => {
    const { title, description, category, subCategory, brand, price, discount, stock } = req.body
    const { id } = req.params
    const categoryExist = await categoryModel.findOne({ _id: category })
    if (!categoryExist) {
        return next(new AppError("cant find category"))
    }

    const subCategoryExist = await subCategoryModel.findOne({ _id: subCategory })
    if (!subCategoryExist) {
        return next(new AppError("cant find subCategory"))
    }

    const brandExist = await brandModel({ _id: brand })
    if (!brandExist) {
        return next(new AppError("cant find brand"))
    }

    const product = await productModel.findOne({ _id: id, createdBy: req.user._id })
    if (!product) {
        return next(new AppError("cant find product"))
    }

    if (title) {
        if (title == product.title) {
            return next(new AppError("this is the same name"))
        }
        if (await productModel.findOne({ title })) {
            return next(new AppError("this title already exist"))
        }
        product.title = title
        product.slug = slugify(title, {
            replacement: '_',
            lower: true,
        })
    }

    if (description) {
        product.description = description
    }

    if (stock) {
        product.stock = stock
    }

    if (price & discount) {
        product.subPrice = price - (price * discount / 100)
        product.price = price
        product.discount = discount

    } else if (price) {
        product.subPrice = price - (price * product.discount / 100)
        product.price = price
    } else if (discount) {
        product.subPrice = product.price - (product.price * discount / 100)
        product.discount = discount
    }

    if (req.files) {
        if (req.files?.image?.lenth) {
            await cloudinary.uploader.destroy(product.image.public_id)
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path, {
                folder: `NoonApp/category/${categoryExist.customId}/subCategory/${subCategoryExist.customId}/products/${product.customId}`
            })
            product.image = { secure_url, public_id }
        }

        if (req.files?.coverImages?.lenth) {
            await cloudinary.api.delete_resources_by_prefix(`NoonApp/category/${categoryExist.customId}/subCategory/${subCategoryExist.customId}/products/${product.customId}`)
            let list = []
            for (const file of req.files.coverImages) {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                    folder: `NoonApp/category/${categoryExist.customId}/subCategory/${subCategoryExist.customId}/products/${product.customId}`
                })
                list.push({ secure_url, public_id })
            }
            product.coverImages = list
        }
    }

    await product.save()

    return res.json({ msg: "done", product })
})
















//========================================getProduct============================================
export const getProduct = asynchandler(async (req, res, next) => {

    const apiFeatures = new ApiFeatures(productModel.find(), req.query)
        .pagination()
        .filter()
        .search()
        .select()
        .sort()

    const product = await apiFeatures.mongooseQuery
    if (!product) {
        return next(new AppError("cant find product"))
    }
    return res.json({ msg: 'done', product, page: apiFeatures.page })
})