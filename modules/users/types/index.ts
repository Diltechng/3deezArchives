import { GetUsersQueryInput, InviteUserInput as ZodInviteUserInput } from "@/shared/schemas";
import { GetUsersMeta, UserListItem } from "@/shared/contracts/users";

export interface InviteUserInput {
  invitee: ZodInviteUserInput;
  inviter: {
    userId: string;
  }
}

export interface GetUsersInput {
  filters: GetUsersQueryInput;
}

export interface GetUsersOutput {
  users: UserListItem[];
  meta: GetUsersMeta;
}