import { UserRole, UserStatus } from "@/shared/constants/enums";
import { GetUsersQueryInput } from "@/shared/schemas/user/get-users-query.schema";
import { Pagination } from "@/shared/types/pagination";

export interface GetUsersInput {
  filters: GetUsersQueryInput;
}

export interface GetUsersOutput {
  users: UserSummary[];
  meta: GetUsersMeta;
  pagination: Pagination;
}

export interface GetUsersMeta {
  totalAdmins: number;
  totalStaffs: number;
}

export interface UserSummary {
 id: string;
 fullName: string | null;
 email: string;
 role: UserRole;
 status: UserStatus;
 postsCount: number;
};