import brandModel from "../../db/models/brand.model.js";
import AppError from "../../utils/classError.js";
import cloudinary from "../../utils/cloudinary.js"
import asynchandler from "../../utils/asyncHandler.js"
import { nanoid } from "nanoid";
import slugify from "slugify";


//==================================================addBrand====================================
export const addBrand = asynchandler(async (req, res, next) => {
    const { name } = req.body;
    const exist = await brandModel.findOne({ name })
    if (exist) {
        return next(new AppError("brand name already exist"))
    }
    if (!req.file) {
        return next(new AppError("please upload image"))
    }
    const customId = nanoid(5)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `NoonApp/brands/${customId}`,
    })
    const brand = await brandModel.create({
        name,
        slug: slugify(name, {
            replacement: '_',
            lower: true,
        }),
        image: { secure_url, public_id },
        createdBy: req.user._id,
        customId
    })
    if (!brand) {
        return next(new AppError("brand not created"))
    }
    return res.status(201).json({ msg: "done", brand })
})
//==================================================getBrands===========================================
export const getBrands = asynchandler(async (req, res, next) => {
    const { name } = req.params
    const brands = await brandModel.findOne({ name, createdBy: req.user._id })
    if (!brands) {
        return next(new AppError("brands not found"))
    }
    return res.status(200).json({ msg: "done", brands })
})
//==================================================updateBrands===========================================
export const updateBrands = asynchandler(async (req, res, next) => {
    const { name } = req.body
    const { id } = req.params
    const brand = await brandModel.findOne({ _id: id, createdBy: req.user._id })
    if (!brand) {
        return next(new AppError("brands not found"))
    }
    if (name) {
        if (name === brand.name) {
            return next(new AppError("this name is the same name"))
        }
        if (await brandModel.findOne({ name })) {
            return next(new AppError("name already exist"))
        }
        brand.name = name
        brand.slug = slugify(name, {
            replacement: '_',
            lower: true,
        })
    }
    if (req.file) {
        await cloudinary.uploader.destroy(brand.image.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `NoonApp/brands/${brand.customId}`
        })
        brand.image = { secure_url, public_id }
    }
    await brand.save()
    return res.status(200).json({ msg: "done", brand })
})
//=========================================================deletebrand===================================
export const deletebrand = asynchandler(async (req, res, next) => {
    const { id } = req.params
    const brands = await brandModel.findOneAndDelete({ _id: id, createdBy: req.user._id })
    if (!brands) {
        return next(new AppError("brands not found"))
    }
    await cloudinary.api.delete_resources_by_prefix(`NoonApp/brands/${brands.customId}`)
    await cloudinary.api.delete_folder(`NoonApp/brands/${brands.customId}`)
    return res.status(200).json({ msg: "done" })
})