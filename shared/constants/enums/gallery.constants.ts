// ==================================================================
// ======================= Event Visibility =======================
// ==================================================================

export const EventVisibility = {
  PRIVATE: "private",
  ADMIN_ONLY: "admin_only",
  PUBLIC: "public",
} as const;

export const EventVisibilityValues = Object.values(EventVisibility) as [
  EventVisibility,
  ...EventVisibility[]
];

export type EventVisibility = (typeof EventVisibility)[keyof typeof EventVisibility];