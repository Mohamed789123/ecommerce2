import subCategoryModel from "../../db/models/subcategory.model.js";
import AppError from "../../utils/classError.js";
import cloudinary from "../../utils/cloudinary.js"
import asynchandler from "../../utils/asyncHandler.js"
import { nanoid } from "nanoid";
import slugify from "slugify";
import categoryModel from "../../db/models/category.model.js";

//=================================================addSubCategory===========================================
export const addsubCategory = asynchandler(async (req, res, next) => {
    const { name, category } = req.body
    const categorys = await categoryModel.findById(category)
    if (!categorys) {
        return next(new AppError("category not found"))
    }
    const subcategoryList = await subCategoryModel.findOne({ name })
    if (subcategoryList) {
        return next(new AppError("subCategory name  already token  "))
    }
    if (!req.file) {
        return next(new AppError("Please upload image"))
    }
    const customId = nanoid(5)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `NoonApp/category/${categorys.customId}/subCategory/${customId}`
    })
    const categories = await subCategoryModel.create({
        name,
        slug: slugify(name, {
            replacement: '_',
            lower: true,
        }),
        image: { secure_url, public_id },
        createdBy: req.user._id,
        category,
        customId,
    })
    if (!categories) {
        return next(new AppError("cant add new subcategory"))
    }
    res.status(201).json({ msg: "done", categories })
})
//=================================================updateSubCategory==================================================
export const updateSubCategory = asynchandler(async (req, res, next) => {
    const { name } = req.body
    const { id } = req.params
    const subcategory = await subCategoryModel.findOne({ _id: id, createdBy: req.user._id })
    if (!subcategory) {
        return next(new AppError("subcategory not found"))
    }
    if (name) {
        if (name === subcategory.name) {
            return next(new AppError("failed it is the same name"))
        }
        if (await subCategoryModel.findOne({ name })) {
            return next(new AppError("name already exist"))
        }
        subcategory.name = name
        subcategory.slug = slugify(name, {
            replacement: '_',
            lower: true,
        })
    }
    const category = await categoryModel.findOne({ _id: subcategory.category })
    if (!category) {
        return next(new AppError("category not found"))
    }
    if (req.file) {
        await cloudinary.uploader.destroy(subcategory.image.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `NoonApp/category/${category.customId}/subCategory/${subcategory.customId}`
        })
        subcategory.image = { secure_url, public_id }
    }
    await subcategory.save()

    return res.status(200).json({ msg: "done", subcategory })
})
//==================================================getSubCategory===================================================
export const getSubCategory = asynchandler(async (req, res, next) => {
    const subCategory = await subCategoryModel.find({}).populate([
        {
            path: 'category',
            select: 'name -_id'
        },
        {
            path: "createdBy",
            select: "name -_id"
        }
    ])
    if (!subCategory) {
        return next(new AppError("subcategory not found"))
    }
    return res.status(200).json({ msg: "done", subCategory })
})
//=================================================deleteSubCategory==================================================
export const deleteSubCategory = asynchandler(async (req, res, next) => {
    const { id } = req.params

    const subcategory = await subCategoryModel.findOneAndDelete({ _id: id, createdBy: req.user._id })
    if (!subcategory) {
        return next(new AppError("subcategory not found"))
    }
    const categorys = await categoryModel.findOne({ _id: subcategory.category })
    if (!categorys) {
        return next(new AppError("category not found"))
    }
    await cloudinary.api.delete_resources_by_prefix(`NoonApp/category/${categorys.customId}/subCategory/${subcategory.customId}`)
    await cloudinary.api.delete_folder(`NoonApp/category/${categorys.customId}/subCategory/${subcategory.customId}`)
    return res.status(200).json({ msg: "done" })
})