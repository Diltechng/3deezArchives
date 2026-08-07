import { GetUsersQueryInput } from "@/shared/schemas";
import { GetUsersMeta, UserListItem } from "@/shared/contracts/users.contract";

export interface GetUsersInput {
  filters: GetUsersQueryInput;
}

export interface GetUsersOutput {
  users: UserListItem[];
  meta: GetUsersMeta;
}