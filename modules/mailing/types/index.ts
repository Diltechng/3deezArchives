export interface SendVerificationEmailInput {
  inviteeEmail: string;
  inviteeRole: string;
  otp: string;
  inviterEmail: string;
  inviterName: string;
  invitationJwt: string;
}