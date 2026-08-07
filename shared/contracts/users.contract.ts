import { UserRole, UserStatus } from "../constants/enums";
import { Pagination } from "../types/pagination";
import { TResponse } from "./common.contract";

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

export class PostUserDto {
  constructor(
    public readonly id: string,
    public readonly name: string | null,
    public readonly role: string,
  ) {}
}

export type GetUserProfileResponse = TResponse<UserProfileData>

export type GetUsersResponse = TResponse<UserListItem[], GetUsersMeta>;