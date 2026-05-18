import { mailService, validateResendVerification } from "@/modules/mailing";
import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/api/error-handler";
import { verificationService } from "@/modules/auth/verification.service";


export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();

  const validatedData = validateResendVerification(body);

  const { invitationToken, otp, email } = await verificationService.generateNewToken(validatedData);

  await mailService.sendVerificationEmail({
    invitationToken,
    otp,
    email,
  });

  return NextResponse.json({
    success: true,
    message: "Verification code sent succuessfully"
  });
})