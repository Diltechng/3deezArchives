import { ALL_PERMISSIONS } from "@/shared/constants/permissions.constants";
import { pgEnum } from "drizzle-orm/pg-core";

export const permissionEnum = pgEnum("permission_enum", ALL_PERMISSIONS);