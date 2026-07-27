import { db as database } from "@/db";
import { users } from "@/db/schema";
import { NotFoundError, UnauthorizedError } from "@/lib/errors";
import { ApiErrorCode } from "@/shared/errors/error-codes";
import { UpdateEmailInput, UpdateFullNameInput, UpdatePasswordInput } from "@/shared/schemas/account/update.schema";
import { eq } from "drizzle-orm";
import { passwordService, PasswordService } from "../password/password.service";

class AccountService {
  constructor(
    private db: typeof database,
    private passwordService: PasswordService
  ) {}

  async updateUserFullName(data: UpdateFullNameInput, userId: string) {
    const [user] = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      throw new NotFoundError("We encounted an error verifying your details", {
        code: ApiErrorCode.USER_NOT_FOUND
      });
    }

    const [result] = await this.db
      .update(users)
      .set({ name: data.name })
      .where(eq(users.id, userId))
      .returning({ id: users.id });

    return result;
  }

  async updateUserEmail(data: UpdateEmailInput, userId: string) {
    const [user] = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      throw new NotFoundError("We encounted an error verifying your details", {
        code: ApiErrorCode.USER_NOT_FOUND
      });
    }

    const [result] = await this.db
      .update(users)
      .set({ email: data.email })
      .where(eq(users.id, userId))
      .returning({ id: users.id });

    return result;
  }

  async updateUserPassword(data: UpdatePasswordInput, userId: string) {
    const [user] = await this.db
      .select({ id: users.id, passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      throw new NotFoundError("We encounted an error verifying your details", {
        code: ApiErrorCode.USER_NOT_FOUND
      });
    }

    const passwordMatch = await this.passwordService.compare(data.currentPassword, user.passwordHash);

    if (!passwordMatch) {
      throw new UnauthorizedError("The current password you entered is incorrect", {
        code: ApiErrorCode.INVALID_CREDENTIALS
      });
    }

    const newPasswordHash = await this.passwordService.hash(data.newPassword);

    const [result] = await this.db
      .update(users)
      .set({ passwordHash: newPasswordHash })
      .where(eq(users.id, userId))
      .returning({ id: users.id });

    return result;
  }
}

export const accountService = new AccountService(
  database,
  passwordService,
);