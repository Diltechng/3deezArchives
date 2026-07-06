export interface CompanyInviteEmailProps {
  invitedByUsername: string;
  invitedByEmail: string;
  companyName: string;
  inviteLink: string;
  inviteRole: string;
}

export function renderCompanyInviteEmail({
  companyName,
  inviteLink,
  invitedByEmail,
  invitedByUsername,
  inviteRole
}: CompanyInviteEmailProps) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Invitation</title>
</head>
<body style="background-color: #f9fafb; margin: 0; padding: 40px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">

  <div style="max-width: 465px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 32px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
    
    <div style="text-align: center; margin-top: 16px;">
      <h1 style="color: #4f46e5; font-size: 24px; font-weight: 700; letter-spacing: -0.025em; margin: 0;">
        ${companyName} <span style="color: #1f2937; font-weight: 400;">Events</span>
      </h1>
    </div>

    <div style="margin-top: 32px;">
      <p style="color: #1f2937; font-size: 16px; line-height: 24px; margin: 0 0 16px 0;">
        Hello there,
      </p>
      <p style="color: #4b5563; font-size: 15px; line-height: 24px; margin: 0;">
        <strong>${invitedByUsername}</strong> (<a href="mailto:${invitedByEmail}" style="color: #4f46e5; text-decoration: none;">${invitedByEmail}</a>) has invited you to join the <strong>${companyName} Events Archive</strong> with the role of <span style="background-color: #e0e7ff; color: #4f46e5; padding: 2px 8px; border-radius: 4px; font-weight: 500; font-size: 14px; white-space: nowrap;">${inviteRole}</span>.
      </p>
    </div>

    <div style="background-color: #f9fafb; border: 1px solid #f3f4f6; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <p style="color: #1f2937; font-weight: 600; font-size: 14px; margin: 0 0 8px 0;">
        As an Admin, you will be able to:
      </p>
      <ul style="color: #4b5563; font-size: 14px; line-height: 22px; margin: 0; padding-left: 20px;">
        <li style="margin-bottom: 6px;">Upload and manage past event media (videos, photos).</li>
        <li style="margin-bottom: 6px;">Edit event metadata, descriptions.</li>
        <li style="margin-bottom: 0;">Manage user access levels and view engagement analytics, depending on the role assigned to you.</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 32px 0 24px 0;">
      <a href="${inviteLink}" style="background-color: #4f46e5; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block; transition: background-color 0.2s ease;">
        Accept Admin Invitation
      </a>
    </div>

    <p style="color: #9ca3af; font-size: 12px; line-height: 18px; text-align: center; margin: 0; padding: 0 12px;">
      This invitation was intended for you. If you were not expecting this invite, you can safely ignore this email. This link will expire in 7 days.
    </p>

    <div style="border-top: 1px solid #e5e7eb; margin: 24px 0;"></div>

    <div style="text-align: center;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        © 2026 ${companyName} Inc. All rights reserved.
      </p>
      <p style="color: #9ca3af; font-size: 12px; margin: 4px 0 0 0;">
        No. 7, 3rd Avenue, Gwarinpa, Abuja, and No. 4, Murtala Nyako Commercial Complex, Opposite Old Secretariat, Minna.
      </p>
    </div>

  </div>
</body>
</html>
  `;
}