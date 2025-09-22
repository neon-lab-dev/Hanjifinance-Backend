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
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const crypto_1 = __importDefault(require("crypto"));
function generateUserId() {
    const prefix = "HFU";
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    const random = crypto_1.default.randomBytes(3).toString("hex").toUpperCase(); // 6-char random
    return `${prefix}-${date}-${random}`;
}
const userSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        unique: true,
        default: generateUserId,
    },
    avatar: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },
    pinCode: { type: String, required: false },
    city: { type: String, required: false },
    addressLine1: {
        type: String,
        required: false,
        trim: true,
    },
    addressLine2: {
        type: String,
        required: false,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        enum: ["user", "admin", "moderator", "super-admin"],
        default: "user",
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default: false,
    },
    isSuspended: {
        type: Boolean,
        required: false,
        default: false,
    },
    isOtpVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpireAt: { type: Date },
    passwordChangedAt: {
        type: Date,
        required: false,
    },
    purchasedCourses: [
        {
            courseId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Course",
                required: true,
            },
            isAttendedOnExam: {
                type: Boolean,
                default: false,
            },
            isPassed: {
                type: Boolean,
                default: false,
            },
            examLimitLeft: {
                type: Number,
                default: 3,
            },
            score: {
                type: Number,
                default: 0,
            },
        },
    ],
}, {
    timestamps: true,
});
// Hash password before saving
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password")) {
            this.password = yield bcrypt_1.default.hash(this.password, Number(config_1.default.bcrypt_salt_round));
        }
        next();
    });
});
// Hide password after saving
userSchema.post("save", function (doc, next) {
    doc.password = "";
    next();
});
// Static methods
userSchema.statics.isUserExists = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.findOne({ email }).select("+password");
    });
};
userSchema.statics.isPasswordMatched = function (plainTextPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plainTextPassword, hashedPassword);
    });
};
userSchema.index({ otpExpireAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { isOtpVerified: false } });
// Export the model
exports.User = (0, mongoose_1.model)("User", userSchema);
