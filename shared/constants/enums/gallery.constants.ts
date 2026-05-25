// ==================================================================
// ======================= Post Visibility =======================
// ==================================================================

export const PostVisibility = {
  PRIVATE: "private",
  ADMIN_ONLY: "admin_only",
  PUBLIC: "public",
} as const;

export const PostVisibilityValues = Object.values(PostVisibility) as [
  PostVisibility,
  ...PostVisibility[]
];

export type PostVisibility = (typeof PostVisibility)[keyof typeof PostVisibility];