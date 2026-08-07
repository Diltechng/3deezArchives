import { PermissionValues } from "@/shared/constants/permissions";
import { pgEnum } from "drizzle-orm/pg-core";

export const permissionEnum = pgEnum("permission_enum", PermissionValues);