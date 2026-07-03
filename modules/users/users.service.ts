import { db } from "@/db";
import { and, asc, count, desc, eq, gte, ilike, lte, or, sql } from "drizzle-orm";
import { users, posts } from "@/db/schema";
import { GetUsersInput, GetUsersOutput } from "./users.types";

class UsersService {
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