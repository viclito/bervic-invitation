import nodemailer from "nodemailer";

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail(toEmail: string, otp: string) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #F8F3EA; padding: 40px 20px; color: #221C17;">
      <div style="max-w: 500px; margin: 0 auto; background-color: #ffffff; border: 2px solid #D9A441; border-radius: 20px; padding: 30px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); text-align: center;">
        <div style="width: 50px; height: 50px; background-color: #7A1F2B; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
          <span style="color: #D9A441; font-size: 24px; font-weight: bold;">✦</span>
        </div>
        <h1 style="margin: 10px 0 0 0; color: #221C17; font-size: 26px; font-weight: 700;">Bervic Invitations</h1>
        <p style="color: #7A1F2B; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 5px;">Verify Your Email</p>
        
        <hr style="border: none; border-top: 1px solid #EFE7D8; margin: 20px 0;" />
        
        <p style="font-size: 14px; color: #555555; line-height: 1.5;">
          Thank you for joining Bervic! Please use the 6-digit verification code below to complete your registration and verify your email address:
        </p>
        
        <div style="background-color: #F8F3EA; border: 2px dashed #7A1F2B; border-radius: 12px; padding: 15px; margin: 25px 0; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #7A1F2B;">
          ${otp}
        </div>
        
        <p style="font-size: 12px; color: #888888; margin-bottom: 0;">
          This code is valid for 10 minutes. If you did not request this registration code, please ignore this email.
        </p>
        
        <div style="margin-top: 30px; font-size: 11px; color: #aaaaaa; border-top: 1px solid #EFE7D8; padding-top: 15px;">
          © ${new Date().getFullYear()} Bervic. All rights reserved.
        </div>
      </div>
    </div>
  `;

  return await transporter.sendMail({
    from: process.env.SMTP_FROM || `"Bervic Invitations" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `${otp} is your Bervic Verification Code`,
    html: htmlContent,
  });
}
