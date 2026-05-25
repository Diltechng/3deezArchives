import z from "zod";
import { RoleSchema, UserIdSchema } from "../shared";

export const AccessTokenPayloadSchema = z.object({
  userId: UserIdSchema,
  role: RoleSchema,
});

export type AccessTokenPayload = z.infer<typeof AccessTokenPayloadSchema>;