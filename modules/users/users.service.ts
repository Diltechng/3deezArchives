import { db } from "@/db";
import { and, asc, count, desc, eq, gt, gte, ilike, lte, or, sql } from "drizzle-orm";
import { users, invitations, posts } from "@/db/schema";
import { generateInvitationToken, generateOTP, sha256Hash } from "@/lib/crypto";
import { AccountAlreadyExistsError, ApiErrorCode, ConflictError, NotFoundError } from "@/lib/errors";
import { days } from "@/modules/utils/time";
import bcrypt from "bcrypt";
import { GetUsersInput, GetUsersOutput, InviteUserInput } from "./types";

class UsersService {
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

  async getUsers(data: GetUsersInput): Promise<GetUsersOutput> {
    const { date, limit, page, role, search, status, sortBy } = data.filters;

    const filters = [
      ...(search? [or(
        ilike(users.name, `%${search}%`),
        ilike(users.email, `%${search}%`)
      )]: []),
      
      ...(status? [eq(users.status, status)]: []),
      ...(role? [eq(users.role, role)]: []),
      ...(date.from? [gte(users.createdAt, date.from)]: []),
      ...(date.to? [lte(users.createdAt, date.to)]: [])
    ];

    const orderCriteria = sortBy === "oldest"
      ? [asc(users.createdAt), asc(users.id)]
      : [desc(users.createdAt), desc(users.id)];

    const offset = (page - 1) * limit;

    const [{ totalUsersCount }] = await db.select({ totalUsersCount: sql<number>`count(*)::int` })
      .from(users)
      .where(and(...filters));

    const [{ totalAdminCount }] = await db.select({ totalAdminCount: sql<number>`count(*)::int` })
      .from(users)
      .where(and(...filters, eq(users.role, "admin")));

    const [{ totalStaffCount }] = await db.select({ totalStaffCount: sql<number>`count(*)::int` })
      .from(users)
      .where(and(...filters, eq(users.role, "staff")));

    const result = await db.select({
      id: users.id,
      fullName: users.name,
      email: users.email,
      role: users.role,
      status: users.status,
      postsCount: count(posts.id)
    }).from(users)
    .leftJoin(posts, eq(users.id, posts.uploadedBy))
    .groupBy(users.id)
    .offset(offset)
    .limit(limit)
    .where(and(...filters))
    .orderBy(...orderCriteria);

    const meta = {
      pagination: {
        page,
        limit,
        total: totalUsersCount,
        totalPages: Math.ceil(totalUsersCount / limit),
        hasNextPage: page < Math.ceil(totalUsersCount / limit),
        hasPreviousPage: page > 1,
      },
      totalAdmins: totalAdminCount,
      totalStaffs: totalStaffCount,
    }

    return {
      users: result,
      meta
    };
  }
}

export const usersService = new UsersService();