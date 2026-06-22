import { UserRole, UserStatus } from "../constants/enums";
import { ResponseData, SerializeDates } from "../types/api";
import { Pagination } from "../types/pagination";

export interface GetUsersMeta {
  pagination: Pagination;
  totalAdmins: number;
  totalStaffs: number;
}

export interface UserListItem {
 id: string;
 fullName: string | null;
 email: string;
 role: UserRole;
 status: UserStatus;
 postsCount: number;
};

export type GetUsersResponse = ResponseData<UserListItem[], GetUsersMeta>;