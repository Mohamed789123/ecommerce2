import categoryModel from "../../db/models/category.model.js";
import AppError from "../../utils/classError.js";
import cloudinary from "../../utils/cloudinary.js"
import asynchandler from "../../utils/asyncHandler.js"
import { nanoid } from "nanoid";
import slugify from "slugify";
import subCategoryModel from "../../db/models/subcategory.model.js";



//============================================addCategory==========================================
export const addCategory = asynchandler(async (req, res, next) => {
    const { name } = req.body
    const categoryList = await categoryModel.findOne({ name })
    if (categoryList) {
        return next(new AppError("Category name  already token  "))
    }
    if (!req.file) {
        return next(new AppError("Please upload image"))
    }
    const customId = nanoid(5)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `NoonApp/category/${customId}`
    })

    req.filePath = `NoonApp/category/${customId}`

    const category = await categoryModel.create({
        name,
        slug: slugify(name, {
            replacement: '_',
            lower: true,
        }),
        image: { secure_url, public_id },
        createdBy: req.user._id,
        customId,
    })
    if (!category) {
        return next(new AppError("cant add new category"))
    }

    req.data = {
        model: categoryModel,
        id: category._id
    }

    res.status(201).json({ msg: "done", category })
})
//============================================updateCategory================================================
export const updateCategory = asynchandler(async (req, res, next) => {
    const { name } = req.body
    const { id } = req.params
    const category = await categoryModel.findOne({ _id: id, createdBy: req.user._id })
    if (!category) {
        return next(new AppError("cant find category"))
    }
    if (name) {
        if (name === category.name) {
            return next(new AppError("failed this is same name"))
        }
        if (await categoryModel.findOne({ name })) {
            return next(new AppError("name already exist"))
        }
        category.name = name
        category.slug = slugify(name, {
            replacement: '_',
            lower: true,
        })
    }
    if (req.file) {
        await cloudinary.uploader.destroy(category.image.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `NoonApp/category/${category.customId}`
        })
        category.image = { secure_url, public_id }
    }
    await category.save()
    res.status(200).json({ msg: "done", category })
})
//=============================================getCategory=========================================
export const getCategory = asynchandler(async (req, res, next) => {
    const category = await categoryModel.find({}).populate({
        path: "subCategory",
        select: "name -_id"
    })
    if (!category) {
        return next(new AppError("cant find category"))
    }
    res.status(200).json({ msg: "done", category })
})

//=========================================deleteCategory====================================
export const deleteCategory = asynchandler(async (req, res, next) => {
    const { id } = req.params
    const categories = await categoryModel.findOneAndDelete({ _id: id, createdBy: req.user._id })
    if (!categories) {
        return next(new AppError("cant find category"))
    }
    await subCategoryModel.deleteMany({ category: categories._id })

    await cloudinary.api.delete_resources_by_prefix(`NoonApp/category/${categories.customId}`)
    await cloudinary.api.delete_folder(`NoonApp/category/${categories.customId}`)
    return res.status(200).json({ msg: "done" })
})