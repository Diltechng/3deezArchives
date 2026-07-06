import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { UnauthorizedError } from "@/lib/errors";
import { ApiErrorCode } from "@/shared/errors/error-codes";
import { SignInInput } from "@/shared/schemas";
import bcrypt from "bcrypt";


class AuthService {
  async authenticate(data: SignInInput) {
    const [user] = await db.select({
      id: users.id,
      role: users.role,
      status: users.status,
      passwordHash: users.passwordHash,
    })
    .from(users).where(eq(users.email, data.email));

    if (!user || user.status !== "active" || !user.passwordHash)
      throw new UnauthorizedError("Invalid login credentials", {
        code: ApiErrorCode.INVALID_CREDENTIALS
      });

    const passwordMatch = await bcrypt.compare(data.password, user.passwordHash);
    
    if (!passwordMatch)
      throw new UnauthorizedError("Invalid login credentials", {
        code: ApiErrorCode.INVALID_CREDENTIALS
      });

    return { userId: user.id, role: user.role }
  }
}

export const authService = new AuthService();