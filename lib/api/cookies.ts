import { days } from "@/utils/time";
import { cookies } from "next/headers";

export async function setRefreshTokenCookie(refreshToken: string) {
  (await cookies()).set("refresh_token", refreshToken, {
    maxAge: days(7),
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/api/v1/auth"
  });
}