// =========================================================
// ======================= User Role =======================
// =========================================================

export const UserRole = {
  ADMIN: "admin",
  STAFF: "staff"
} as const;

export const UserRoleValues = Object.values(UserRole) as [
  UserRole,
  ...UserRole[]
];

export type UserRole = (typeof UserRole)[keyof typeof UserRole];




// ===========================================================
// ======================= User Status =======================
// ===========================================================

const UserStatus = {
  INVITED: "invited",
  ACTIVE: "active",
  SUSPENDED: "suspended"
} as const;

export const UserStatusValues = Object.values(UserStatus) as [
  UserStatus,
  ...UserStatus[]
];

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];




// =================================================================
// ======================= Invitation Status =======================
// =================================================================

export const InvitationStatus = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  EXPIRED: "expired",
  REVOKED: "revoked",
  COMPLETED: "completed",
} as const;

export const InvitationStatusValues = Object.values(InvitationStatus) as [
  InvitationStatus,
  ...InvitationStatus[]
];

export type InvitationStatus = (typeof InvitationStatus)[keyof typeof InvitationStatus];