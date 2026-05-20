// ==================================================================
// ======================= Gallery Visibility =======================
// ==================================================================

export const GalleryVisibility = {
  PRIVATE: "private",
  ADMIN_ONLY: "admin_only",
  PUBLIC: "public",
} as const;

export const GalleryVisibilityValues = Object.values(GalleryVisibility) as [
  GalleryVisibility,
  ...GalleryVisibility[]
];

export type GalleryVisibility = (typeof GalleryVisibility)[keyof typeof GalleryVisibility];