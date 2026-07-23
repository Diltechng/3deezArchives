import { UserRole, UserStatus } from "../constants/enums";
import { ResponseData, SerializeDates } from "../types/api";
import { Pagination } from "../types/pagination";
import { TResponse } from "./Response";

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

export type UserProfileData = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type GetUserProfileResponse = TResponse<UserProfileData>

export type GetUsersResponse = ResponseData<UserListItem[], GetUsersMeta>;