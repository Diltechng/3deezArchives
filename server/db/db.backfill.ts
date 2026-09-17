import { db } from ".";
import { eq, inArray, or } from "drizzle-orm";
import { organisations, permissions, rolePermissions, roles, users } from "./schema";
import { PLATFORM_ORGANISATION_ID } from "./seed/organisations";
import { DbClient, DbTransaction } from "./types";
import { ORGANISATION_ADMIN_CODE, ORGANISATION_ADMIN_NAME } from "@/server/lib/constants";
import { PERMISSION_CATEGORIES, PERMISSIONS } from "@/shared/constants/permissions.constants";
import { env } from "../lib/env";


export const THREE_DEEZ_ORG_ID = "c5ebf607-300e-4c27-85a7-7969e41ddd81";
export const THREE_DEEZ_ADMIN_ROLE_ID = "89e7cfe5-d5cc-41a5-8007-1bfe675aeda8";
export const THREE_DEEZ_MEMBER_ROLE_ID = "682b764a-1bf3-4121-8f6d-9618ada56dea";

export async function create3DeezOrg(tx: DbTransaction) {
  await tx.insert(organisations)
    .values({
      id: THREE_DEEZ_ORG_ID,
      name: "3Deez Global Investment LTD",
      description: "Specializing in delivering tailored software solutions that transform the way you work",
    })
    .onConflictDoNothing();

  console.log("3Deez organisation backfilled successfully");
}

export async function create3DeezRoles(tx: DbTransaction) {
  await tx.insert(roles)
    .values([
      {
        id: THREE_DEEZ_ADMIN_ROLE_ID,
        organisationId: THREE_DEEZ_ORG_ID,
        name: ORGANISATION_ADMIN_NAME,
        code: ORGANISATION_ADMIN_CODE,
        description: "Full privileges within the organisation."
      },
      {
        id: THREE_DEEZ_MEMBER_ROLE_ID,
        organisationId: THREE_DEEZ_ORG_ID,
        name: "Member",
        code: "MEMBER",
        description: "Organisation member role"
      }
    ])
    .onConflictDoNothing();

  console.log("3Deez roles backfilled successfully")
}

export async function create3DeezRolePermissions(tx: DbTransaction) {
  const permissionList = await tx.select()
    .from(permissions)
    .where(
      or(
        inArray(permissions.category, [
          PERMISSION_CATEGORIES.CATEGORIES,
          PERMISSION_CATEGORIES.EVENTS,
          PERMISSION_CATEGORIES.INVITATIONS,
          PERMISSION_CATEGORIES.ROLES,
          PERMISSION_CATEGORIES.USERS,
        ]),
        inArray(permissions.name, [
          PERMISSIONS.ORGANISATIONS_UPDATE
        ])
      )
    );

  console.log(permissionList);
  // await tx.insert(rolePermissions)
  //   .values(
  //     permissionList.map(permission => ({
  //       roleId: THREE_DEEZ_ADMIN_ROLE_ID,
  //       permissionId: permission.id,
  //     }))
  //   );
}

export async function updateUsersOrgAndRole(tx: DbTransaction) {
  await tx.update(users)
    .set({
      organisationId: THREE_DEEZ_ORG_ID,
      roleId: THREE_DEEZ_MEMBER_ROLE_ID,
    })
    .where(eq(users.role, "staff"))

  await tx.update(users)
    .set({
      organisationId: THREE_DEEZ_ORG_ID,
      roleId: THREE_DEEZ_ADMIN_ROLE_ID,
    })
    .where(eq(users.role, "admin"))

  await tx.update(users)
    .set({
      organisationId: PLATFORM_ORGANISATION_ID,
      roleId: (await tx.select({ id: roles.id }).from(roles).where(eq(roles.code, "SUPER_ADMIN")))[0].id,
    })
    .where(eq(users.email, "ghalimusa53@gmail.com"))

  console.log("Users role and organisation backfilled successfully")
}

async function main(db: DbClient) {
  console.log("env", env);
  console.log("process.env", process.env);
  await db.transaction(async (tx) => {
    // await create3DeezOrg(tx);
    // await create3DeezRoles(tx);
    await create3DeezRolePermissions(tx);
    // await updateUsersOrgAndRole(tx);
  });
}

main(db)
  .then(() => process.exit(0))
  .catch(err => {
    console.log(err);
    process.exit(1);
  });