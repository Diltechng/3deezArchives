import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { users, verificationTokens } from "@/db/schema";
import { generateOTP } from "@/lib/crypto";
import { RegisterInput } from "../validation/register.schema";
import { SetPasswordInput } from "../validation/set-password.schema";
import { VerifyEmailInput } from "@/features/mailing";
import { ForbiddenError, TokenExpiredError, VerificationError } from "@/features/errors";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);


class AuthService {
  async registerUser(data: RegisterInput) {
    const saltRounds = 10;
    const token = generateOTP();
    const tokenHash = await bcrypt.hash(token, saltRounds);
  
    const userId = await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          email: data.email,
          name: data.fullName,
        })
        .returning();
  
      await tx.insert(verificationTokens).values({
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + dayjs.duration(1, "hour").asMilliseconds()),
      });
  
      return user.id;
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
      if (!record) throw new VerificationError("Invalid verification Token");

      const user = record.users;
      const verificationToken = record.verificationTokens;
      const match = await bcrypt.compare(data.token, verificationToken.tokenHash);
      
      if (new Date() >= verificationToken.expiresAt)
        throw new TokenExpiredError("Verification token has expired");

      if (!match)
        throw new VerificationError("Invalid verification token");

      await tx
        .update(users)
        .set({ isVerified: true })
        .where(eq(users.id, user.id));

      await tx
        .delete(verificationTokens)
        .where(eq(verificationTokens.id, verificationToken.id));
    });
  }

  async setPassword(data: SetPasswordInput) {
    const saltRounds = 10;

    const [user] = await db.select().from(users)
      .where(and(eq(users.id, data.userId), eq(users.email, data.email)));
    
    if (!user?.isVerified)
      throw new ForbiddenError("You are not authorized to make this request");
    
    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));
  }
}

export const authService = new AuthService();