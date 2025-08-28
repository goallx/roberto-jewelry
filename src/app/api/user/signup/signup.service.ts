import UserModel from "@/models/User";
import nodemailer from "nodemailer";

class SignupService {
  private static instance: SignupService | null = null;

  constructor() {}

  public static getInstance(): SignupService {
    if (!SignupService.instance) {
      SignupService.instance = new SignupService();
    }
    return SignupService.instance;
  }

  async verifyCode(email: string, code: string) {
    const { verificationCode } = await UserModel.findOne(
      { email },
      "verificationCode"
    );
    if (verificationCode === code) {
      await UserModel.findOneAndUpdate(
        { email },
        { isEmailVerified: true, verificationCode: "" }
      );
      return true;
    }
    return false;
  }

  sendVerificationEmail = async (toEmail: string, fullName: string) => {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const verificationCode = Math.floor(
      10000 + Math.random() * 90000
    ).toString();

    await UserModel.findOneAndUpdate(
      { email: toEmail },
      { verificationCode: verificationCode }
    );

    const mailOptions = {
      from: "info@robertojewelry.com",
      to: toEmail,
      subject: `Your Roberto Jewelry Verification Code: ${verificationCode}`,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f8f8;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://firebasestorage.googleapis.com/v0/b/general-ebf2c.firebasestorage.app/o/roberto-jewerly%2Froberto-logo-1.png?alt=media&token=cacc86a9-43aa-4090-99da-9ed54525ee2d" alt="Roberto Jewelry Logo" style="width: 150px; height: auto;">
                    </div>
                    <h3 style="color: #333333; font-size: 24px; margin-bottom: 20px;">Dear ${fullName},</h3>
                    <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                        Thank you for choosing <strong>Roberto Jewelry</strong>. To ensure the security of your account, we require you to verify your email address.
                    </p>
                    <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                        Please use the following verification code to complete your registration:
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <p style="font-size: 28px; font-weight: bold; color: #d4af37; background-color: #f4f4f4; padding: 15px; border-radius: 8px; display: inline-block;">
                            ${verificationCode}
                        </p>
                    </div>
                    <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                        <strong>Important:</strong> Do not share this code. This code will expire in <strong>10 minutes</strong>.
                    </p>
                    <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                        If you did not request this code, please contact support at <a href="mailto:info@robertojewelry.com" style="color: #d4af37; text-decoration: none;">info@robertojewelry.com</a>.
                    </p>
                    <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                        Best regards,<br>
                        <strong>The Roberto Jewelry Team</strong>
                    </p>
                </div>
            </div>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${toEmail}`);
      return true;
    } catch (error) {
      console.error("Error sending verification email:", error);
      return false;
    }
  };
}

export default SignupService;
