"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const product_model_1 = __importDefault(require("./product.model"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const sendImageToCloudinary_1 = require("../../../utils/sendImageToCloudinary");
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Add product (admin only)
const addProduct = (payload, files) => __awaiter(void 0, void 0, void 0, function* () {
    let imageUrls = [];
    if (files && files.length > 0) {
        const uploadedImages = yield Promise.all(files.map((file) => (0, sendImageToCloudinary_1.sendImageToCloudinary)(file.originalname, file.path)));
        imageUrls = uploadedImages.map((img) => img.secure_url);
    }
    // Generate custom productId like HFP-1234
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    const productId = `HFP-${randomNumber}`;
    const payloadData = Object.assign(Object.assign({}, payload), { productId,
        imageUrls });
    const result = yield product_model_1.default.create(payloadData);
    return result;
});
// Get all products
const getAllProducts = (keyword, category, minPrice, maxPrice) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {};
    if (keyword) {
        query.$or = [
            { name: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
        ];
    }
    if (category && category !== "all") {
        query.category = { $regex: category, $options: "i" };
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
        query["sizes.discountedPrice"] = {};
        if (minPrice !== undefined)
            query["sizes.discountedPrice"].$gte = minPrice;
        if (maxPrice !== undefined)
            query["sizes.discountedPrice"].$lte = maxPrice;
    }
    const result = yield product_model_1.default.find(query);
    return result;
});
// Get single product by ID
const getSingleProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.default.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    return result;
});
// Update product
const updateProduct = (id, payload, files) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield product_model_1.default.findById(id);
    if (!existing) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    let imageUrls;
    if (files && files.length > 0) {
        const uploadedImages = yield Promise.all(files.map((file) => (0, sendImageToCloudinary_1.sendImageToCloudinary)(file.originalname, file.path)));
        imageUrls = uploadedImages.map((img) => img.secure_url);
    }
    const updatePayload = Object.assign(Object.assign({}, payload), (imageUrls && { imageUrls }));
    const result = yield product_model_1.default.findByIdAndUpdate(id, updatePayload, {
        new: true,
        runValidators: true,
    });
    return result;
});
// Delete product by ID
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findById(id);
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    // Delete all product images from Cloudinary
    if (product.imageUrls && product.imageUrls.length > 0) {
        for (const url of product.imageUrls) {
            try {
                const parts = url.split("/");
                const filename = parts[parts.length - 1];
                const publicId = decodeURIComponent(filename.split(".")[0]);
                console.log("Deleting Cloudinary image with publicId:", publicId);
                yield cloudinary_1.v2.uploader.destroy(publicId);
                console.log("Cloudinary image deleted successfully");
            }
            catch (err) {
                console.error("Error deleting Cloudinary image:", err);
            }
        }
    }
    // Delete product from DB
    const result = yield product_model_1.default.findByIdAndDelete(id);
    return result;
});
exports.ProductServices = {
    addProduct,
    getAllProducts,
    getSingleProductById,
    updateProduct,
    deleteProduct,
};
