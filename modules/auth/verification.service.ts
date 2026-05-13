import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users, verificationTokens } from "@/db/schema";
import { generateOTP } from "@/lib/crypto";
import { ForbiddenError, VerificationError } from "@/lib/errors";
import { ResendVerificationInput } from "@/lib/schemas";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

class VerificationService {
  async generateNewToken(data: ResendVerificationInput) {
    const saltRounds = 10;
    const token = generateOTP();
    const tokenHash = await bcrypt.hash(token, saltRounds);
  
    const email = await db.transaction(async tx => {
      const [user] = await tx.select().from(users)
        .where(eq(users.id, data.userId));
      
      if (!user)
        throw new VerificationError("Invalid user id");
  
      if (user.status === "verified")
        throw new ForbiddenError("You are not allowed to access this resource after verification");
  
      if (user.status === "active")
        throw new ForbiddenError("You are not allowed to access this resource after registration");
    
      await tx.delete(verificationTokens).where(eq(verificationTokens.userId, user.id));
    
      await tx.insert(verificationTokens).values({
        tokenHash,
        userId: data.userId,
        expiresAt: new Date(Date.now() + dayjs.duration(1, "hour").asMilliseconds())
      });
  
      return user.email
    });

    return { email, token };
  }
}

export const verificationService = new VerificationService();