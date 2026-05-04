import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema";
import { generateRandomString, generateHash } from "../crypto";


interface RegisterUserRequest {
  email: string;
  fullName: string;
}

export async function registerUser(request: RegisterUserRequest) {
  const verificationToken = generateRandomString();

  await db.transaction(async (tx) => {
    const [user] = await tx.insert(users).values({
      email: request.email,
      name: request.fullName,
    }).returning();  

    await tx.insert(verificationTokens).values({
      userId: user.id,
      tokenHash: generateHash(verificationToken)
    });
  });

  return verificationToken;
}