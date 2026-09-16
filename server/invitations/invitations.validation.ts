import { BadRequestError } from "@/lib/errors";
import { ApiErrorCode } from "@/shared/errors/error-codes";
import { AcceptInviteSchema, GetInvitationsQuerySchema, InvitationJwtPayloadSchema } from "@/shared/schemas";
import z from "zod";

export function validateInvitationJwtPayload(data: unknown) {
  const result = InvitationJwtPayloadSchema.safeParse(data);
  
  if (!result.success) {
    const flattenedError = z.flattenError(result.error).fieldErrors;

    throw new BadRequestError("Invalid or malformed invitation token", {
      code: ApiErrorCode.INVALID_FETCH_QUERY,
      details: flattenedError
    });
  }

  return result.data;
}

export function validateAcceptInvite(data: unknown) {
  const result = AcceptInviteSchema.safeParse(data);

  if (!result.success) {
    const flattenedError = z.flattenError(result.error).fieldErrors;

    throw new BadRequestError("Invalid or malformed invite acceptance data.", {
      details: flattenedError
    });
  }

  return result.data;
}

export function validateGetInvitationsQuery(data: unknown) {
  const result = GetInvitationsQuerySchema.safeParse(data);
  
  if (!result.success) {
    const flattenedError = z.flattenError(result.error).fieldErrors;

    throw new BadRequestError("Invalid or malformed get invitations query", {
      code: ApiErrorCode.INVALID_FETCH_QUERY,
      details: flattenedError
    });
  }

  return result.data;
}