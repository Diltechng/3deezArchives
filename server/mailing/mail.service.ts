import nodemailer from "nodemailer";
import { SendInvitationEmailInput } from "./mailing.types";
import { renderCompanyInviteEmail } from "@/server/utils/email";
import { InternalServerError } from "@/server/lib/errors";
import { env } from "../lib/env";


class MailService {
  async sendInvitationEmail(data: SendInvitationEmailInput) {
    const email = env.GOOGLE_MAIL_USER;
    const appPassword = env.GOOGLE_APP_PASSWORD;
    const frontedUrl = env.FRONTEND_URL;
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