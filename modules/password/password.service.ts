import bcrypt from "bcrypt";

export class PasswordService {
  async hash(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async compare(password: string, passwordHash: string) {
    return await bcrypt.compare(password, passwordHash);
  }
}

export const passwordService = new PasswordService();