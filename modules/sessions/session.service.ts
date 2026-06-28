import { GoneError, InternalServerError, BadRequestError } from "@/lib/errors";
import { ApiErrorCode } from "@/shared/errors/error-codes";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { sha256Hash } from "@/lib/crypto";
import { days } from "@/shared/utils/time";
import { eq, sql } from "drizzle-orm";
import { AccessTokenPayload } from "@/shared/schemas";

class SessionService {
  signJwt(payload: AccessTokenPayload) {
    const secret = process.env.JWT_SECRET;

    if (!secret)
      throw new InternalServerError();

    const token = jwt.sign(payload, secret, {
      expiresIn: "1h"
    });

    return token;
  }

  verifyJwt(token: string) {
    const secret = process.env.JWT_SECRET;

    if (!secret)
      throw new InternalServerError();

    const payload = jwt.verify(token, secret);
    
    return payload;
  }

  async createSession(userId: string) {
    const refresToken = "rt-v1_" + crypto.randomBytes(32).toString("base64url");
    const tokenHash = sha256Hash(refresToken);
    const expiresAt = new Date(Date.now() + days(7));

    await db.insert(sessions).values({
      userId,
      tokenHash,
      expiresAt
    });

    return refresToken;
  }

  async verifySession(token: string) {
    const tokenHash = sha256Hash(token);

    const [record] = await db.select({
      users: {
        id: users.id,
        role: users.role,
      },
      sessions: {
        id: sessions.id,
        revoked: sessions.revoked,
        expiresAt: sessions.expiresAt,
      }
    }).from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.tokenHash, tokenHash));

    if (!record)
      throw new BadRequestError("Invalid or expired auth session", {
        code: ApiErrorCode.INVALID_AUTH_SESSION
      });

    if (Date.now() >= record.sessions.expiresAt.getTime())
      throw new GoneError("Auth session has expired", {
        code: ApiErrorCode.EXPIRED_AUTH_SESSION
      });

    if (record.sessions.revoked)
      throw new BadRequestError("Invalid or expired auth session", {
        code: ApiErrorCode.INVALID_AUTH_SESSION
      });

    const refreshToken = await this.createSession(record.users.id);
    
    await db.update(sessions).set({
      revoked: true,
    }).where(eq(sessions.id, record.sessions.id));

    return {
      payload: {
        userId: record.users.id,
        role: record.users.role
      },
      refreshToken
    }
  }

  async revokeSession(token: string) {
    const tokenHash = sha256Hash(token);

    await db.update(sessions).set({
      revoked: true,
    }).where(eq(sessions.tokenHash, tokenHash));
  }
}

export const sessionService = new SessionService();