"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ProductSchema = new mongoose_1.Schema({
    productId: { type: String, required: true, unique: true },
    imageUrls: { type: [String], required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    clothDetails: { type: String },
    productStory: { type: String },
    category: { type: String, required: true },
    madeIn: { type: String },
    colors: [
        {
            colorName: { type: String, required: true },
            sizes: [
                {
                    size: { type: String, required: true },
                    quantity: { type: Number, required: true },
                    basePrice: { type: Number, required: true },
                    discountedPrice: { type: Number, required: true },
                },
            ],
        },
    ],
}, { timestamps: true });
const Product = (0, mongoose_1.model)("Product", ProductSchema);
exports.default = Product;
