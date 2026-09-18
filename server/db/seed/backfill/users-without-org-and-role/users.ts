import { and, eq, isNull } from "drizzle-orm";
import { roles, users } from "@/server/db/schema";
import { DbTransaction } from "@/server/db/types";
import { BACKFILL_ORGANISATION_ID } from "./organisations";
import { BACKFILL_ORGANISATION_ADMIN_ID, BACKFILL_ORGANISATION_MEMBER_ID } from "./roles";
import { PLATFORM_ORGANISATION_ID } from "../../organisations";
import { env } from "@/server/lib/env";

export async function backfillUsers(tx: DbTransaction) {
  const withoutRoleAndOrganisation = [
    isNull(users.organisationId),
    isNull(users.roleId),
    isNull(users.deletedAt),
  ];

  // Get platform super admin role id
  const [superAdminRole] = await tx.select({ id: roles.id })
    .from(roles)
    .where(and(
      eq(roles.organisationId, PLATFORM_ORGANISATION_ID),
      eq(roles.code, "SUPER_ADMIN"),
      isNull(roles.deletedAt),
    ));


  if (!superAdminRole) {
    throw new Error("Super admin role not available");
  }

  const [existingSuperAdmin] = await tx.select()
    .from(users)
    .where(and(
      eq(
        users.organisationId,
        PLATFORM_ORGANISATION_ID
      ),
      eq(
        users.roleId,
        superAdminRole.id
      ),
      isNull(users.deletedAt),
    ));

  if (!existingSuperAdmin) {
    if (!env.SUPER_ADMIN_EMAIL) {
      throw new Error("Missing super admin email environment variable")
    }
    
    // Backfill platform super admin
    await tx.update(users)
      .set({
        organisationId: PLATFORM_ORGANISATION_ID,
        roleId: superAdminRole.id
      })
      .where(and(
        eq(users.email, env.SUPER_ADMIN_EMAIL),
        ...withoutRoleAndOrganisation,
      ))
  }

  // Backfill organisation admin
  const [adminUser] = await tx.select({ id: users.id })
    .from(users)
    .where(and(
      eq(users.role, "admin"),
      ...withoutRoleAndOrganisation,
    ));

  if (adminUser) {
    await tx.update(users)
      .set({
        organisationId: BACKFILL_ORGANISATION_ID,
        roleId: BACKFILL_ORGANISATION_ADMIN_ID,
      })
      .where(and(eq(users.id, adminUser.id)));
  }

  // Backfill other users as member users
  await tx.update(users)
    .set({
      roleId: BACKFILL_ORGANISATION_MEMBER_ID,
      organisationId: BACKFILL_ORGANISATION_ID,
    })
    .where(and(...withoutRoleAndOrganisation));

  console.log("User organisation and role backfilled successfully");
}