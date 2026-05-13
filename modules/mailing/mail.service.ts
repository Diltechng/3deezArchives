import nodemailer from "nodemailer";


interface SendVerificationEmailInput {
  email: string;
  token: string;
}

class MailService {
  async sendVerificationEmail(data: SendVerificationEmailInput) {
    const email = process.env.GOOGLE_MAIL_USER;
    const appPassword = process.env.GOOGLE_APP_PASSWORD;
    const service = "gmail";
    
    const transporter = nodemailer.createTransport({
      service,
      auth: {
        user: email,
        pass: appPassword
      }
    });

    const mailOptions = {
      from: email,
      to: data.email,
      subject: "Verification your email",
      html: `
        <h1 style="font-size: 18px; font-weight: bold; color: #101010;">Hi there,</h1>
        <h2 style="font-size: 14px; font-weight: 500; color: #101010;">Thank you for signing up! To complete your registration, please enter the following verification code on the sign-up page:</h2>
        <div style="font-size: 18px; font-weight: bold; text-align: center; margin: 20px 0; padding: 10px; background-color: #f4f4f4; border: 1px solid #ddd; color: #2f2f2f; border-radius: 8px;">
          ${data.token}
        </div>
        <p style="font-size: 14px; color: #101010;">This code will expire in 1 hour.</p>
        <p style="font-size: 14px; color: #101010;">If you didn't create an account, you can safely ignore this email.</p>
        <p style="font-size: 14px; color: #101010;">Thanks.</p>
      `
    }

    await transporter.sendMail(mailOptions);
  }
}

export const mailService = new MailService();