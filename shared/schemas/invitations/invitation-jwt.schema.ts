import z from "zod";
import { InvitationIdSchema, InvitationTokenSchema } from ".";

export const InvitationJwtPayloadSchema = z.object({
  invitationId: InvitationIdSchema,
  invitationToken: InvitationTokenSchema,
});

export type InvitationJwtPayloadInput = z.infer<typeof InvitationJwtPayloadSchema>;