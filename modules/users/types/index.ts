import { GetUsersQueryInput } from "@/shared/schemas/user/get-users-query.schema";

export interface GetUsersInput {
  filters: GetUsersQueryInput;
}