// ==================================================================
// ======================= Moment Visibility =======================
// ==================================================================

export const MomentVisibility = {
  PRIVATE: "private",
  ADMIN_ONLY: "admin_only",
  PUBLIC: "public",
} as const;

export const MomentVisibilityValues = Object.values(MomentVisibility) as [
  MomentVisibility,
  ...MomentVisibility[]
];

export type MomentVisibility = (typeof MomentVisibility)[keyof typeof MomentVisibility];