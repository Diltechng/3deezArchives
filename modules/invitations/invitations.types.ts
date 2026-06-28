import { InviteUserInput as ZodInviteUserInput } from "@/shared/schemas";

export interface InviteUserInput {
  invitee: ZodInviteUserInput;
  inviter: {
    userId: string;
  }
}

export interface InvitationJwtPayload {
  invitationToken: string;
  invitationId: string;
}