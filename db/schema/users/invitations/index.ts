import { pgTable, uuid, text, varchar, timestamp, pgEnum, boolean } from "drizzle-orm/pg-core";
import { userRoleEnum, timestamps } from "../../shared";
import { users } from "../user";


export const invitationStatusEnum = pgEnum("invitation_status", [
  "pending", "accepted", "rejected", "expired", "revoked", "completed"
]);

export const invitations = pgTable("invites", {
  // identity
  id: uuid().defaultRandom().primaryKey(),
  email: text("email").notNull(),
  role: userRoleEnum("role").default("staff").notNull(),
  
  // invitation details
  tokenHash: varchar("token_hash").unique().notNull(),
  otpHash: varchar("otp_hash").notNull(),
  invitedBy: uuid("invited_by").references(() => users.id, { onDelete: "set null" }),
  
  // lifecycle
  emailVerified: boolean("email_verified").default(false).notNull(),
  status: invitationStatusEnum("status").default("pending").notNull(),
  
  // timestamps
  completedAt: timestamp("completed_at", { withTimezone: true }),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ...timestamps,
});