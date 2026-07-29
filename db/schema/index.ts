import {
  users,
  sessions,
  invitations,
  organisations,
  userRelations,
  organisationRelations
} from "./users";
import { media, categories, posts, postRelations, mediaRelations } from "./gallery";

export * from "./users";
export * from "./gallery";

export const schema = {
  users,
  sessions,
  invitations,
  media,
  posts,
  categories,
  organisations,

  postRelations,
  mediaRelations,
  userRelations,
  organisationRelations,
} as const;

export type DbSchema = typeof schema;