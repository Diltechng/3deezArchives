import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema/users/user";
import { validateVerifyEmailInput } from "@/lib/validation/verify-email.schema";
import { generateHash } from "@/lib/crypto";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { verifyEmail } from "@/lib/services/auth";


export const PATCH = async (req: NextRequest) => {
  const body = await req.json();

  const validatedData = validateVerifyEmailInput(body);

  await verifyEmail(validatedData);

  return NextResponse.json({
    success: true,
    message: "Email verified succuessfully"
  });
}