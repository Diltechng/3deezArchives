import { pgTable, uuid, text, varchar, timestamp, pgEnum, boolean } from "drizzle-orm/pg-core";
import { userRoleEnum, timestamps } from "../../shared";
import { users } from "../users";
import { InvitationStatusValues } from "@/shared/constants/enums";
import { organisations } from "../organisations";
import { roles } from "../roles";


export const invitationStatusEnum = pgEnum("invitation_status", InvitationStatusValues);

export const invitations = pgTable("invites", {
  // identity
  id: uuid().defaultRandom().primaryKey(),
  email: text("email").notNull(),
  role: userRoleEnum("role").default("staff").notNull(),
  
  // invitation details
  tokenHash: varchar("token_hash").unique().notNull(),
  otpHash: varchar("otp_hash").notNull(),
  
  // lifecycle
  emailVerified: boolean("email_verified").default(false).notNull(),
  status: invitationStatusEnum("status").default("pending").notNull(),
  
  // Foreign keys
  organisationId: uuid("organisation_id").references(() => organisations.id, { onDelete: "cascade" }),
  roleId: uuid("role_id").references(() => roles.id, { onDelete: "cascade" }),
  invitedBy: uuid("invited_by").references(() => users.id, { onDelete: "set null" }),

  // timestamps
  completedAt: timestamp("completed_at", { withTimezone: true }),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ...timestamps,
});