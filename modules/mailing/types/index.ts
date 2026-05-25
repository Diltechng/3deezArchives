export interface SendVerificationEmailInput {
  email: string;
  otp: string;
  invitationToken: string;
}