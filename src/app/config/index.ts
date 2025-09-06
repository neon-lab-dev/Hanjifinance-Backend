import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
  node_env: process.env.NODE_ENV,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  reset_password_ui_url: process.env.RESET_PASSWORD_UI_URL,
  razorpay_api_key: process.env.RAZORPAY_API_KEY,
  razorpay_api_secret: process.env.RAZORPAY_API_SECRET,
  payment_redirect_url: process.env.PAYMENT_REDIRECT_URL,
  boardroom_banter_plan_id: process.env.BOARDROOM_BANTER_PLAN_ID,
};
