/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { sendEmail } from "../utils/sendEmail";

export const sendSubscriptionStatusEmails = async (user: any, subscriptionDetails: any, action: 'paused' | 'active') => {
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
    await sendEmail(user.email, userSubject, userHtmlBody);
    
    // Send email to admin
    await sendEmail(adminEmail, adminSubject, adminHtmlBody);
    
    console.log(`Subscription ${action} emails sent successfully`);
  } catch (error) {
    console.error(`Failed to send ${action} emails:`, error);
    // Don't throw error here as subscription action was completed successfully
    // Just log the email failure
  }
};

export const sendSubscriptionEmails = async (user: any, subscriptionDetails: any) => {
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
    await sendEmail(user.email, userSubject, userHtmlBody);

    // Send email to admin
    await sendEmail(adminEmail, adminSubject, adminHtmlBody);

    console.log("Subscription confirmation emails sent successfully");
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email is not valid.");
  }
};