import { db } from "@/db";
import { and, eq, gt } from "drizzle-orm";
import { users, invitations } from "@/db/schema";
import { generateInvitationToken, generateOTP, sha256Hash } from "@/lib/crypto";
import { AccountAlreadyExistsError, ApiErrorCode, ConflictError } from "@/lib/errors";
import { InviteUserInput } from "@/lib/schemas";
import { days } from "@/utils/time";
import bcrypt from "bcrypt";

class UsersService {
  async inviteUser(data: InviteUserInput) {
    const saltRounds = 10;
    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, saltRounds);
    const invitationToken = generateInvitationToken();
    const tokenHash = sha256Hash(invitationToken);
  
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, data.email));

    if (existingUser)
      throw AccountAlreadyExistsError();

    const [existingInvite] = await db
      .select({ id: invitations.id })
      .from(invitations)
      .where(and(
        eq(invitations.email, data.email),
        eq(invitations.status, "pending"),
        gt(invitations.expiresAt, new Date())
      ));

    if (existingInvite)
      throw new ConflictError("A pending invitation for this email already exists", {
        code: ApiErrorCode.PENDING_INVITATION_EXISTS
      });

    await db
      .insert(invitations)
      .values({
        email: data.email,
        ...(data.role && {
          role: data.role
        }),
        tokenHash,
        otpHash,
        expiresAt: new Date(Date.now() + days(1)),
      });

    return { otp, invitationToken };
  }

  async getUsers() {
    const result = await db.select({
      fullName: users.name,
      email: users.email,
      role: users.role,
      status: users.status,
    }).from(users);

    return result;
  }
}

export const usersService = new UsersService();