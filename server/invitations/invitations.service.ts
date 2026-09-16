import { db } from "@/db";
import { invitations, users } from "@/db/schema";
import { generateInvitationToken, generateOTP, sha256Hash } from "@/lib/crypto";
import { BadRequestError, ConflictError, GoneError, InternalServerError, NotFoundError } from "@/lib/errors";
import { AccountAlreadyExistsError } from "./invitations.errors";
import { GetInvitationsInput, InvitationJwtPayload, InviteUserInput } from "./invitations.types";
import { ApiErrorCode } from "@/shared/errors/error-codes";
import { and, asc, count, desc, eq, gt, gte, ilike, lte, or, sql } from "drizzle-orm";
import { DUMMY_TOKEN_HASH } from "@/lib/constants";
import { AcceptInviteInput } from "@/shared/schemas";
import { days } from "../../shared/utils/time";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

class InvitationsService {
  async inviteUser(data: InviteUserInput) {
    const saltRounds = 10;
    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, saltRounds);
    const invitationToken = generateInvitationToken();
    const tokenHash = sha256Hash(invitationToken);

    const [inviter] = await db.select({
      name: users.name,
      email: users.email,
    }).from(users)
    .where(eq(users.id, data.inviter.userId));

    if (!inviter) {
      throw new NotFoundError("Inviter is not or no longer a member of the archive.", {
        code: ApiErrorCode.USER_NOT_FOUND
      });
    }
  
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, data.invitee.email));

    if (existingUser)
      throw AccountAlreadyExistsError();

    const [existingInvite] = await db
      .select({ id: invitations.id })
      .from(invitations)
      .where(and(
        eq(invitations.email, data.invitee.email),
        eq(invitations.status, "pending"),
        gt(invitations.expiresAt, sql`now()`)
      )).limit(1);

    if (existingInvite)
      throw new ConflictError("A pending invitation for this email already exists", {
        code: ApiErrorCode.PENDING_INVITATION_EXISTS
      });

    const [result] = await db
      .insert(invitations)
      .values({
        email: data.invitee.email,
        ...(data.invitee.role && {
          role: data.invitee.role
        }),
        tokenHash,
        otpHash,
        expiresAt: new Date(Date.now() + days(1)),
      }).returning({ id: invitations.id });

    return {
      otp,
      invitationToken,
      invitationId: result.id,
      inviter
    };
  }

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
      throw new GoneError("This invitation has expired", {
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

  async getInvitiations(data: GetInvitationsInput) {
    const { date, limit, page, role, search, status, sortBy } = data.filters;

    const filters = [
      ...(search? [or(
        ilike(invitations.email, `%${search}%`)
      )]: []),
      
      ...(status? [eq(invitations.status, status)]: []),
      ...(role? [eq(invitations.role, role)]: []),
      ...(date.from? [gte(invitations.createdAt, date.from)]: []),
      ...(date.to? [lte(invitations.createdAt, date.to)]: [])
    ];

    const visibilityCriteria = [
      gte(invitations.expiresAt, new Date())
    ]

    const orderCriteria = sortBy === "oldest"
      ? [asc(invitations.createdAt), asc(invitations.id)]
      : [desc(invitations.createdAt), desc(invitations.id)];

    const offset = (page - 1) * limit;

    const [{ totalInvitationsCount }] = await db.select({ totalInvitationsCount: sql<number>`count(*)::int` })
      .from(invitations)
      .where(and(...visibilityCriteria));

    const result = await db.select({
      id: invitations.id,
      email: invitations.email,
      role: invitations.role,
      status: invitations.status,
    }).from(invitations)
    .offset(offset)
    .limit(limit)
    .where(and(...filters, ...visibilityCriteria))
    .orderBy(...orderCriteria);

    const meta = {
      pagination: {
        page,
        limit,
        total: totalInvitationsCount,
        totalPages: Math.ceil(totalInvitationsCount / limit),
        hasNextPage: page < Math.ceil(totalInvitationsCount / limit),
        hasPreviousPage: page > 1,
      },
    }

    return {
      invitations: result,
      meta
    };
  }
}

export const invitationsService = new InvitationsService();