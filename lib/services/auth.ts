import { db } from "@/db";
import { generateRandomString, generateHash } from "../crypto";
import { RegisterInput } from "../validation/register.schema";
import { VerifyEmailInput } from "../validation/verify-email.schema";
import { eq } from "drizzle-orm";
import { VerificationError } from "../errors";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { users, verificationTokens } from "@/db/schema/users";

dayjs.extend(duration);

export async function registerUser(data: RegisterInput) {
  const verificationToken = generateRandomString();

  await db.transaction(async (tx) => {
    const [user] = await tx
      .insert(users)
      .values({
        email: data.email,
        name: data.fullName,
      })
      .returning();

    await tx.insert(verificationTokens).values({
      userId: user.id,
      tokenHash: generateHash(verificationToken),
      expiresAt: new Date(dayjs.duration(1, "hour").asMilliseconds()),
    });
  });

  return verificationToken;
}

export async function verifyEmail(userId: string, data: VerifyEmailInput) {
  await db.transaction(async (tx) => {
    const result = await tx
      .select({ users, verificationTokens })
      .from(verificationTokens)
      .innerJoin(users, eq(verificationTokens.userId, users.id))
      .where(eq(verificationTokens.userId, userId));

    const [record] = result;
    if (!record) throw new VerificationError("Invalid Verification Token");

    const user = record.users;
    const verificationToken = record.verificationTokens;

    if (verificationToken.expiresAt >= new Date()) {
      throw new VerificationError("Verification Token has expired");
    }

    await tx
      .update(users)
      .set({ isVerified: true })
      .where(eq(users.id, user.id));

    await tx
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, verificationToken.id));
  });
}
