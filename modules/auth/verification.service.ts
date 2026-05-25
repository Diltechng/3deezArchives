import { db } from "@/db";
import { eq, sql } from "drizzle-orm";
import { invitations } from "@/db/schema";
import { generateOTP, sha256Hash } from "@/lib/crypto";
import { ApiErrorCode, BadRequestError, ExpiredError, ForbiddenError, VerificationError } from "@/lib/errors";
import { ResendVerificationInput } from "@/shared/schemas";
import bcrypt from "bcrypt";

class VerificationService {
  async generateNewToken(data: ResendVerificationInput) {
    const saltRounds = 10;
    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, saltRounds);
    const tokenHash = sha256Hash(data.invitationToken);
  
    const [invitationRecord] = await db.select({
      id: invitations.id,
      email: invitations.email,
      status: invitations.status,
      emailVerified: invitations.emailVerified,
      expiresAt: invitations.expiresAt,
    }).from(invitations)
    .where(eq(invitations.tokenHash, tokenHash));
    
    if (!invitationRecord)
      throw new VerificationError("Invalid invitation", {
        code: ApiErrorCode.INVALID_INVITATION,
      });

    const terminalStatuses = ["expired", "rejected", "revoked", "completed"];
    
    if (terminalStatuses.includes(invitationRecord.status))
      throw new BadRequestError("Invitation is invalid or expired", {
        code: ApiErrorCode.INVALID_INVITATION
      });

    if (invitationRecord.emailVerified)
      throw new ForbiddenError("Verification is already complete");

    if (new Date() >= invitationRecord.expiresAt) {
      await db.update(invitations).set({
        status: "expired",
      }).where(eq(invitations.id, invitationRecord.id));

      throw new ExpiredError("Invite session has expired", {
        code: ApiErrorCode.EXPIRED_INVITATION
      });
    }

    await db.update(invitations).set({
      otpHash,
    }).where(eq(invitations.id, invitationRecord.id));

    return {
      invitationToken: data.invitationToken,
      email: invitationRecord.email,
      otp,
    };
  }
}

export const verificationService = new VerificationService();