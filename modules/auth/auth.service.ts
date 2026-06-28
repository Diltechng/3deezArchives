import { db } from "@/db";
import { eq } from "drizzle-orm";
import { invitations, users } from "@/db/schema";
import { sha256Hash } from "@/lib/crypto";
import { GoneError, UnauthorizedError, BadRequestError } from "@/lib/errors";
import { ApiErrorCode } from "@/shared/errors/error-codes";
import { VerifyEmailInput } from "@/shared/schemas";
import { SignInInput } from "@/shared/schemas";
import bcrypt from "bcrypt";


class AuthService {
  async verifyEmail(data: VerifyEmailInput) {
    const invitationTokenHash = sha256Hash(data.invitationToken);

    const [invitationRecord] = await db
      .select({
        id: invitations.id,
        status: invitations.status,
        otpHash: invitations.otpHash,
        emailVerified: invitations.emailVerified,
        expiresAt: invitations.expiresAt,
      })
      .from(invitations)
      .where(eq(invitations.tokenHash, invitationTokenHash));

    if (!invitationRecord)
      throw new BadRequestError("Invalid or expired invite", {
        code: ApiErrorCode.INVALID_INVITATION
      });

    const terminalStatuses = ["expired", "accepted", "rejected", "revoked", "completed"];
    
    // if (terminalStatuses.includes(invitationRecord.status))
    //   throw new BadRequestError("Invitation is invalid or expired", {
    //     code: ApiErrorCode.INVALID_INVITATION
    //   });

    if (invitationRecord.status)

    if (new Date() >= invitationRecord.expiresAt) {
      // await db.update(invitations).set({
      //   status: "expired",
      // }).where(eq(invitations.id, invitationRecord.id));

      throw new GoneError("Invite session has expired", {
        code: ApiErrorCode.EXPIRED_INVITATION
      });
    }

    if (invitationRecord.emailVerified)
      throw new BadRequestError("This email has already been verified", {
        code: ApiErrorCode.EMAIL_ALREADY_VERIFIED
      });

    const match = await bcrypt.compare(data.otp, invitationRecord.otpHash);
    

    if (!match)
      throw new BadRequestError("Invalid verification code", {
        code: ApiErrorCode.INVALID_VERIFICATION_TOKEN
      });

    await db
      .update(invitations)
      .set({
        status: "accepted",
        emailVerified: true,
      })
      .where(eq(invitations.id, invitationRecord.id));
  }

  async authenticate(data: SignInInput) {
    const [user] = await db.select({
      id: users.id,
      role: users.role,
      status: users.status,
      passwordHash: users.passwordHash,
    })
    .from(users).where(eq(users.email, data.email));

    if (!user || user.status !== "active" || !user.passwordHash)
      throw new UnauthorizedError("Invalid login credentials", {
        code: ApiErrorCode.INVALID_CREDENTIALS
      });

    const passwordMatch = await bcrypt.compare(data.password, user.passwordHash);
    
    if (!passwordMatch)
      throw new UnauthorizedError("Invalid login credentials", {
        code: ApiErrorCode.INVALID_CREDENTIALS
      });

    return { userId: user.id, role: user.role }
  }
}

export const authService = new AuthService();