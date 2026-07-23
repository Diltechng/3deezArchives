import nodemailer from "nodemailer";
import { SendInvitationEmailInput } from "./mailing.types";
import { renderCompanyInviteEmail } from "@/modules/utils/email";
import { InternalServerError } from "@/lib/errors";


class MailService {
  async sendInvitationEmail(data: SendInvitationEmailInput) {
    const email = process.env.GOOGLE_MAIL_USER;
    const appPassword = process.env.GOOGLE_APP_PASSWORD;
    const frontedUrl = process.env.FRONTEND_URL;
    const service = "gmail";

    if (!email || !appPassword || !frontedUrl) {
      throw new InternalServerError();
    }

    const html = renderCompanyInviteEmail({
      companyName: "3Deez Global Investment",
      invitedByEmail: data.inviterEmail,
      invitedByUsername: data.inviterName,
      inviteLink: `${frontedUrl}/invitation/accept?token=${data.invitationJwt}`,
      inviteRole: data.inviteeRole,
    });
    
    const transporter = nodemailer.createTransport({
      service,
      auth: {
        user: email,
        pass: appPassword
      }
    });

    const mailOptions = {
      from: email,
      to: data.inviteeEmail,
      subject: "3Deez Global Events Archive Invitation",
      html
    }

    await transporter.sendMail(mailOptions);
  }
}

export const mailService = new MailService();