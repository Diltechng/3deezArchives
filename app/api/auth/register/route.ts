import { registerUser } from "@/lib/services/auth";
import { sendVerificationEmail } from "@/lib/services/mail";
import { validateRegisterInput } from "@/lib/validation/register.schema";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const validatedData = validateRegisterInput(body);

  const verificationToken = await registerUser(validatedData);

  await sendVerificationEmail({ email: validatedData.email, token: verificationToken });

  return NextResponse.json({
    success: true,
    message: "User registered succuessfully"
  });
}