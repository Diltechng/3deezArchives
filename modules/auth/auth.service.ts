import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users, verificationTokens } from "@/db/schema";
import { generateOTP } from "@/lib/crypto";
import { ApiErrorCode, BadRequestError, ConflictError, ExpiredError, ForbiddenError, UnauthorizedError, VerificationError } from "@/lib/errors";
import { SetPasswordInput, SignUpInput, VerifyEmailInput } from "@/lib/schemas";
import { hours } from "@/utils/time";
import bcrypt from "bcrypt";
import { SignInInput } from "@/lib/schemas/sign-in.schema";


class AuthService {
  async registerUser(data: SignUpInput) {
    const saltRounds = 10;
    const token = generateOTP();
    const tokenHash = await bcrypt.hash(token, saltRounds);
  
    const userId = await db.transaction(async (tx) => {
      const [user] = await tx
        .select()
        .from(users)
        .where(eq(users.email, data.email));

      if (user && (user.status === "active"  || user.status === "verified"))
        throw new ConflictError("An account with this email already exists", {
          code: ApiErrorCode.EMAIL_ALREADY_EXISTS
        });
      
      else if (user && (user.status === "pending")) {
        await tx.delete(verificationTokens)
          .where(eq(verificationTokens.userId, user.id))

        await tx.insert(verificationTokens).values({
          userId: user.id,
          tokenHash,
          expiresAt: new Date(Date.now() + hours(1)),
        });
    
        return user.id;
      }
      
      else if (!user) {
        const [user] = await tx
          .insert(users)
          .values({ email: data.email })
          .returning();
    
        await tx.insert(verificationTokens).values({
          userId: user.id,
          tokenHash,
          expiresAt: new Date(Date.now() + hours(1)),
        });
    
        return user.id;
      }
      
    });
  
    return { userId, token };
  }

  async verifyEmail(data: VerifyEmailInput) {
    await db.transaction(async (tx) => {
      const result = await tx
        .select({ users, verificationTokens })
        .from(verificationTokens)
        .innerJoin(users, eq(verificationTokens.userId, users.id))
        .where(eq(verificationTokens.userId, data.userId));

      const [record] = result;
      if (!record)
        throw new VerificationError("Invalid or expired verification session", {
          code: ApiErrorCode.INVALID_VERIFICATION_SESSION
        });

      const user = record.users;
      const verificationToken = record.verificationTokens;
      const match = await bcrypt.compare(data.token, verificationToken.tokenHash);
      
      if (new Date() >= verificationToken.expiresAt)
        throw new ExpiredError("Verification session has expired", {
          code: ApiErrorCode.EXPIRED_VERIFICATION_SESSION
        });

      if (!match)
        throw new VerificationError("Invalid verification token", {
          code: ApiErrorCode.INVALID_VERIFICATION_TOKEN
        });

      await tx
        .update(users)
        .set({ status: "verified" })
        .where(eq(users.id, user.id));

      await tx
        .delete(verificationTokens)
        .where(eq(verificationTokens.id, verificationToken.id));
    });
  }

  async setPassword(data: SetPasswordInput) {
    const saltRounds = 10;

    const [user] = await db.select().from(users)
      .where(eq(users.id, data.userId));
    
    if (!user)
      throw new BadRequestError("Invalid or expired signup session", {
        code: ApiErrorCode.INVALID_SIGNUP_SESSION
      });

    if (user.status === "pending")
      throw new ForbiddenError("Please verify your email before continuing", {
        code: ApiErrorCode.EMAIL_NOT_VERIFIED
      });

    if (user.status === "active")
      throw new ForbiddenError("Password has already been set for this account", {
        code: ApiErrorCode.PASSWORD_ALREADY_SET
      });

    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    await db.update(users).set({ passwordHash, status: "active" }).where(eq(users.id, user.id));
  }

  async authenticate(data: SignInInput) {
    const [user] = await db.select().from(users)
      .where(eq(users.email, data.email));

    if (!user || user.status !== "active" || !user.passwordHash)
      throw new UnauthorizedError("Invalid login credentials", {
        code: ApiErrorCode.INVALID_CREDENTIALS
      });

    const passwordMatch = await bcrypt.compare(data.password, user.passwordHash);
    
    if (!passwordMatch)
      throw new UnauthorizedError("Invalid login credentials", {
        code: ApiErrorCode.INVALID_CREDENTIALS
      });

    return { userId: user.id }
  }
}

export const authService = new AuthService();