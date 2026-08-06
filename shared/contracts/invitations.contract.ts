import { InvitationStatus, UserRole } from "../constants/enums";
import { TPagination, TResponse } from "./common.contract";

export interface InvitationsListItemDto {
 id: string;
 email: string;
 role: UserRole;
 status: InvitationStatus;
};

export interface GetInvitationsMeta {
  pagination: TPagination;
};

export class VerifiedInvitationDto {
  constructor(
    public email: string,
    public role: UserRole,
    public invitedBy: string | null,
  ) {}
}

export type GetInvitationsResponse = TResponse<InvitationsListItemDto[], GetInvitationsMeta>;
export type VerifyInvitationResponse = TResponse<VerifiedInvitationDto>;