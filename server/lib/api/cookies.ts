import { days } from "@/shared/utils/time";
import { cookies } from "next/headers";
import { env } from "../env";

export async function setRefreshTokenCookie(refreshToken: string) {
  (await cookies()).set("refresh_token", refreshToken, {
    maxAge: days(7),
    httpOnly: true,
    sameSite: "strict",
    secure: env.NODE_ENV === "production",
    path: "/api/v1/auth"
  });
}