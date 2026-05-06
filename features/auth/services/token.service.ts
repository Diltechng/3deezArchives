import { InternalServerError } from "@/features/errors";
import jwt from "jsonwebtoken"

class TokenService {
  signJwt(payload: any) {
    const secret = process.env.JWT_SECRET;

    if (!secret)
      throw new InternalServerError();

    const token = jwt.sign(payload, secret, {
      expiresIn: "6h"
    });

    return token;
  }
}

export const tokenService = new TokenService();