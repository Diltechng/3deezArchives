import { GetUsersMeta, UserSummary } from "@/modules/users/types";
import { ResponseData } from "./api";

export type GetUsersResponse = ResponseData<UserSummary[], GetUsersMeta>;