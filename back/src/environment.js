import "dotenv/config";

export const PORT = process.env.WHATSUB_PORT;
export const DATABASE_HOST = process.env.WHATSUB_DATABASE_HOST;
export const DATABASE_NAME = process.env.WHATSUB_DATABASE_NAME;
export const DATABASE_USER = process.env.WHATSUB_DATABASE_USER;
export const DATABASE_PASSWORD = process.env.WHATSUB_DATABASE_PASSWORD;
export const EMAIL_USER = process.env.WHATSUB_EMAIL_USER;
export const EMAIL_PASS = process.env.WHATSUB_EMAIL_PASS;

console.log("PORT:", PORT);
console.log("DATABASE_HOST:", DATABASE_HOST);
console.log("DATABASE_NAME:", DATABASE_NAME);
console.log("DATABASE_USER:", DATABASE_USER);
console.log("DATABASE_PASSWORD:", DATABASE_PASSWORD);
console.log("EMAIL_USER:", EMAIL_USER);
console.log("EMAIL_PASS:", EMAIL_PASS);
