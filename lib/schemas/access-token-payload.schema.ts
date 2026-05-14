import z from "zod";
import { UserIdSChema } from "./shared";

export const AccessTokenPayloadSchema = z.object({
  userId: UserIdSChema
});

export type AccessTokenPayload = z.infer<typeof AccessTokenPayloadSchema>;