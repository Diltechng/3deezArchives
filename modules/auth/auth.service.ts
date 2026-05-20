import { db } from "@/db";
import { eq, sql } from "drizzle-orm";
import { invitations, users } from "@/db/schema";
import { sha256Hash } from "@/lib/crypto";
import { AccountAlreadyExistsError, ApiErrorCode, BadRequestError, ExpiredError, ForbiddenError, UnauthorizedError, VerificationError } from "@/lib/errors";
import { SetPasswordInput, VerifyEmailInput } from "@/shared/schemas";
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
      throw new VerificationError("Invalid or expired invite", {
        code: ApiErrorCode.INVALID_INVITATION
      });

    const terminalStatuses = ["expired", "accepted", "rejected", "revoked", "completed"];
    
    if (terminalStatuses.includes(invitationRecord.status))
      throw new BadRequestError("Invitation is invalid or expired", {
        code: ApiErrorCode.INVALID_INVITATION
      });

    if (new Date() >= invitationRecord.expiresAt) {
      await db.update(invitations).set({
        status: "expired",
        updatedAt: sql`now()`,
      }).where(eq(invitations.id, invitationRecord.id));

      throw new ExpiredError("Invite session has expired", {
        code: ApiErrorCode.EXPIRED_INVITATION
      });
    }

    if (invitationRecord.emailVerified)
      throw new VerificationError("This email has already been verified", {
        code: ApiErrorCode.EMAIL_ALREADY_VERIFIED
      });

    const match = await bcrypt.compare(data.otp, invitationRecord.otpHash);
    

    if (!match)
      throw new VerificationError("Invalid verification code", {
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

  async setPassword(data: SetPasswordInput) {
    const saltRounds = 10;

    const [invitedUser] = await db.select({
      id: invitations.id,
      email: invitations.email,
      role: invitations.role,
      status: invitations.status,
      emailVerified: invitations.emailVerified,
      expiresAt: invitations.expiresAt,
    }).from(invitations).where(
      eq(invitations.id, data.invitationId)
    );
      
    if (!invitedUser)
      throw new BadRequestError("Invalid or expired signup session", {
        code: ApiErrorCode.INVALID_SIGNUP_SESSION
      });
      
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, invitedUser.email));

    if (existingUser)
      throw AccountAlreadyExistsError();

    const terminalStatuses = ["expired", "rejected", "revoked", "completed"];
    
    if (terminalStatuses.includes(invitedUser.status))
      throw new BadRequestError("Invitation is invalid or expired", {
        code: ApiErrorCode.INVALID_INVITATION
      });

    if (new Date() >= invitedUser.expiresAt) {
      await db.update(invitations).set({
        status: "expired",
        updatedAt: sql`now()`,
      }).where(eq(invitations.id, invitedUser.id));

      throw new ExpiredError("Invite session has expired", {
        code: ApiErrorCode.EXPIRED_INVITATION
      });
    }

    if (invitedUser.status === "pending")
      throw new ForbiddenError("You must accept the invitation before continuing", {
        code: ApiErrorCode.INVITATION_NOT_ACCEPTED
      });

    if (!invitedUser.emailVerified)
      throw new ForbiddenError("Please verify your email before continuing", {
        code: ApiErrorCode.EMAIL_NOT_VERIFIED
      });

    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    await db.transaction(async tx => {
      await tx.insert(users).values({
        email: invitedUser.email,
        role: invitedUser.role,
        status: "active",
        passwordHash,
      });
  
      await tx.update(invitations).set({
        status: "completed",
        completedAt: sql`now()`,
        updatedAt: sql`now()`,
      })
      .where(eq(invitations.id, invitedUser.id));
    });
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