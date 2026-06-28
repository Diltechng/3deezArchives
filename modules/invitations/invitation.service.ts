import { db } from "@/db";
import { invitations, users } from "@/db/schema";
import { sha256Hash } from "@/lib/crypto";
import { AccountAlreadyExistsError, ApiErrorCode, BadRequestError, ConflictError, ExpiredError, GoneError, InternalServerError, NotFoundError, VerificationError } from "@/lib/errors";
import { eq, sql } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { InvitationJwtPayload } from "./types";
import { DUMMY_TOKEN_HASH } from "@/lib/constants";
import { AcceptInviteInput } from "@/shared/schemas";

class InvitationService {
  async verifyInvitation(data: InvitationJwtPayload) {
    const [storedInvitation] = await db
      .select({
        id: invitations.id,
        role: invitations.role,
        email: invitations.email,
        status: invitations.status,
        tokenHash: invitations.tokenHash,
        expiresAt: invitations.expiresAt,
        invitedBy: invitations.invitedBy,
      })
      .from(invitations)
      .where(eq(invitations.id, data.invitationId));

    const isValid = sha256Hash.compare(data.invitationToken, storedInvitation?.tokenHash ?? DUMMY_TOKEN_HASH);

    if (!isValid) {
      throw new BadRequestError("Invalid or expired invitation", {
        code: ApiErrorCode.INVALID_INVITATION
      })
    }

    if (!storedInvitation) {
      throw new NotFoundError("Invalid or expired invitation", {
        code: ApiErrorCode.INVALID_INVITATION
      });
    }
      
    if (storedInvitation.status === "accepted") {
      throw new ConflictError("This invitation has already been accepted", {
        code: ApiErrorCode.INVITATION_ALREADY_USED
      });
    }

    if (storedInvitation.status === "revoked") {
      throw new GoneError("This invitation has been revoked by the administrator", {
        code: ApiErrorCode.INVITATION_REVOKED
      });
    }

    if (new Date() >= storedInvitation.expiresAt) {
      throw new ExpiredError("This invitation has expired", {
        code: ApiErrorCode.EXPIRED_INVITATION
      });
    }

    return {
      email: storedInvitation.email,
      role: storedInvitation.role,
      invitedBy: storedInvitation.invitedBy,
    }
  }

  signInvitationJwt(payload: InvitationJwtPayload) {
    const secret = process.env.INVITATION_JWT_SECRET;

    if (!secret)
      throw new InternalServerError();

    const token = jwt.sign(payload, secret);

    return token;
  }

  verifyInvitationJwt(token: string) {
    const secret = process.env.INVITATION_JWT_SECRET;

    if (!secret)
      throw new InternalServerError();

    const payload = jwt.verify(token, secret);
    
    return payload;
  }

  async acceptInvite(data: AcceptInviteInput & InvitationJwtPayload) {
    const saltRounds = 10;

    const { email, role } = await this.verifyInvitation({
      invitationId: data.invitationId,
      invitationToken: data.invitationToken
    })
      
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email));

    if (existingUser)
      throw AccountAlreadyExistsError();

    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    await db.transaction(async tx => {
      await tx.insert(users).values({
        email,
        name: data.name,
        onboardingCompleted: true,
        role,
        status: "active",
        passwordHash,
      });
  
      await tx.update(invitations).set({
        status: "accepted",
        acceptedAt: sql<Date>`now()`,
      })
      .where(eq(invitations.id, data.invitationId));
    });
  }
}

export const invitationService = new InvitationService();