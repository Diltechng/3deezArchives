import { mailService, validateResendVerification } from "@/modules/mailing";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/api/error-handler";
import { verificationService } from "@/modules/auth/verification.service";


export const POST = handleError(async (req: NextRequest) => {
  const body = await req.json();

  const validatedData = validateResendVerification(body);

  const { email, token } = await verificationService.generateNewToken(validatedData);

  await mailService.sendVerificationEmail({
    email,
    token
  });

  return NextResponse.json({
    success: true,
    message: "Verification code sent succuessfully"
  });
})