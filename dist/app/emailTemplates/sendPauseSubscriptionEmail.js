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
exports.sendSubscriptionEmails = exports.sendSubscriptionStatusEmails = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const sendEmail_1 = require("../utils/sendEmail");
const sendSubscriptionStatusEmails = (user, subscriptionDetails, action) => __awaiter(void 0, void 0, void 0, function* () {
    const actionTense = action === 'paused' ? 'paused' : 'active';
    const actionTitle = action === 'paused' ? 'Paused' : 'Resumed';
    // Email to user
    const userSubject = `Subscription ${actionTitle} - Boardroom Banter`;
    const userHtmlBody = `
  <div style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; padding:30px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
      <h2 style="color:#c0392b; text-align:center;">Boardroom Banter</h2>
      <p style="font-size:16px; color:#333;">Hello <strong>${user.name}</strong>,</p>
      <p style="font-size:15px; color:#555;">
        Your Boardroom Banter subscription has been successfully ${actionTense}.
      </p>
      <div style="background:#f5f5f5; padding:15px; border-radius:6px; margin:20px 0;">
        <p style="font-size:14px; margin:5px 0;"><strong>Subscription ID:</strong> ${subscriptionDetails.razorpaySubscriptionId}</p>
        <p style="font-size:14px; margin:5px 0;"><strong>Status:</strong> ${actionTitle}</p>
        <p style="font-size:14px; margin:5px 0;"><strong>${actionTitle} Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      <p style="font-size:15px; color:#555;">
        ${action === 'paused'
        ? 'Your subscription benefits will be temporarily unavailable while paused. You can resume your subscription at any time from your account settings.'
        : 'Your subscription benefits have been restored. You now have full access to all premium features.'}
      </p>
      <p style="font-size:15px; color:#333; margin-top:30px;">Best regards,</p>
      <p style="font-size:16px; font-weight:bold; color:#c0392b;">The Boardroom Banter Team</p>
    </div>
  </div>
  `;
    // Email to admin
    const adminEmail = "rahul.mitraconsultancy@gmail.com";
    const adminSubject = `Subscription ${actionTitle} - Boardroom Banter`;
    const adminHtmlBody = `
  <div style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; padding:30px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
      <h2 style="color:#c0392b; text-align:center;">Boardroom Banter - Subscription ${actionTitle}</h2>
      <p style="font-size:16px; color:#333;">Hello Admin,</p>
      <p style="font-size:15px; color:#555;">
        A subscription has been ${actionTense}. Here are the details:
      </p>
      <div style="background:#f5f5f5; padding:15px; border-radius:6px; margin:20px 0;">
        <p style="font-size:14px; margin:5px 0;"><strong>Customer Name:</strong> ${user.name}</p>
        <p style="font-size:14px; margin:5px 0;"><strong>Customer Email:</strong> ${user.email}</p>
        <p style="font-size:14px; margin:5px 0;"><strong>Subscription ID:</strong> ${subscriptionDetails.razorpaySubscriptionId}</p>
        <p style="font-size:14px; margin:5px 0;"><strong>${actionTitle} Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p style="font-size:14px; margin:5px 0;"><strong>Action:</strong> ${actionTitle}</p>
      </div>
      <p style="font-size:15px; color:#333; margin-top:30px;">Best regards,</p>
      <p style="font-size:16px; font-weight:bold; color:#c0392b;">Boardroom Banter System</p>
    </div>
  </div>
  `;
    try {
        // Send email to user
        yield (0, sendEmail_1.sendEmail)(user.email, userSubject, userHtmlBody);
        // Send email to admin
        yield (0, sendEmail_1.sendEmail)(adminEmail, adminSubject, adminHtmlBody);
        console.log(`Subscription ${action} emails sent successfully`);
    }
    catch (error) {
        console.error(`Failed to send ${action} emails:`, error);
        // Don't throw error here as subscription action was completed successfully
        // Just log the email failure
    }
});
exports.sendSubscriptionStatusEmails = sendSubscriptionStatusEmails;
const sendSubscriptionEmails = (user, subscriptionDetails) => __awaiter(void 0, void 0, void 0, function* () {
    // Email to user
    const userSubject = "Subscription Confirmation - Boardroom Banter";
    const userHtmlBody = `
  <div style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; padding:30px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
      <h2 style="color:#c0392b; text-align:center;">Boardroom Banter</h2>
      <p style="font-size:16px; color:#333;">Hello <strong>${user.name}</strong>,</p>
      <p style="font-size:15px; color:#555;">
        Thank you for subscribing to Boardroom Banter! Your subscription has been successfully activated.
      </p>
      <div style="background:#f5f5f5; padding:15px; border-radius:6px; margin:20px 0;">
        <p style="font-size:14px; margin:5px 0;"><strong>Subscription ID:</strong> ${subscriptionDetails.razorpaySubscriptionId}</p>
        <p style="font-size:14px; margin:5px 0;"><strong>Status:</strong> Active</p>
        <p style="font-size:14px; margin:5px 0;"><strong>Start Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      <p style="font-size:15px; color:#555;">
        You now have access to all premium features of Boardroom Banter. 
        If you have any questions, please contact our support team.
      </p>
      <p style="font-size:15px; color:#333; margin-top:30px;">Best regards,</p>
      <p style="font-size:16px; font-weight:bold; color:#c0392b;">The Boardroom Banter Team</p>
    </div>
  </div>
  `;
    // Email to admin
    const adminEmail = "rahul.mitraconsultancy@gmail.com";
    const adminSubject = "New Subscription - Boardroom Banter";
    const adminHtmlBody = `
  <div style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; padding:30px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
      <h2 style="color:#c0392b; text-align:center;">Boardroom Banter - New Subscription</h2>
      <p style="font-size:16px; color:#333;">Hello Admin,</p>
      <p style="font-size:15px; color:#555;">
        A new subscription has been purchased. Here are the details:
      </p>
      <div style="background:#f5f5f5; padding:15px; border-radius:6px; margin:20px 0;">
        <p style="font-size:14px; margin:5px 0;"><strong>Customer Name:</strong> ${user.name}</p>
        <p style="font-size:14px; margin:5px 0;"><strong>Customer Email:</strong> ${user.email}</p>
        <p style="font-size:14px; margin:5px 0;"><strong>Subscription ID:</strong> ${subscriptionDetails.razorpaySubscriptionId}</p>
        <p style="font-size:14px; margin:5px 0;"><strong>Purchase Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      <p style="font-size:15px; color:#333; margin-top:30px;">Best regards,</p>
      <p style="font-size:16px; font-weight:bold; color:#c0392b;">Boardroom Banter System</p>
    </div>
  </div>
  `;
    try {
        // Send email to user
        yield (0, sendEmail_1.sendEmail)(user.email, userSubject, userHtmlBody);
        // Send email to admin
        yield (0, sendEmail_1.sendEmail)(adminEmail, adminSubject, adminHtmlBody);
        console.log("Subscription confirmation emails sent successfully");
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Email is not valid.");
    }
});
exports.sendSubscriptionEmails = sendSubscriptionEmails;
