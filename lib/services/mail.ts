import nodemailer from "nodemailer";


interface SendVerificationEmailRequest {
  email: string;
  token: string;
}

export async function sendVerificationEmail(request: SendVerificationEmailRequest) {
  const email = process.env.GOOGLE_MAIL_USER;
  const appPassword = process.env.GOOGLE_APP_PASSWORD;
  const service = "gmail";
  
  const baseUrl = process.env.APP_URL;
  const verificationUrl = `${baseUrl}/auth/email-verification?token=${request.token}`;
  
  const transporter = nodemailer.createTransport({
    service,
    auth: {
      user: email,
      pass: appPassword
    }
  });

  const mailOptions = {
    from: email,
    to: request.email,
    subject: "Email Verification",
    html: `<a href="${verificationUrl}">Click here to verify</a>`
  }

  await transporter.sendMail(mailOptions);
}