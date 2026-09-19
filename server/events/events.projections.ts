import { RelationalProjection } from "../utils";

const categoryBadgeProjection = {
  columns: {
    id: true,
    name: true,
    slug: true,
    description: true,
  },
} satisfies RelationalProjection<"categories">;

const mediaAttachmentProjection = {
  columns: {
    id: true,
    secureUrl: true,
    createdAt: true,
    bytes: true,
    width: true,
    height: true,
    uploadedBy: true,
  }
} satisfies RelationalProjection<"media">;

const userCompactProjection = {
  columns: {
    id: true,
    name: true,
    role: true,
  }
} satisfies RelationalProjection<"users">;

const eventBaseProjection = {
  columns: {
    id: true,
    title: true,
    description: true,
    visibility: true,
    tags: true,
    dateOfMoment: true,
    createdAt: true,
    updatedAt: true,
  }
} satisfies RelationalProjection<"events">;

export const eventListProjection = {
  ...eventBaseProjection,
  with: {
    category: categoryBadgeProjection,
    coverMedia: mediaAttachmentProjection,
    media: mediaAttachmentProjection,
    uploadedByUser: userCompactProjection,
  }
} satisfies RelationalProjection<"events">;

export const eventDetailProjection = {
  ...eventBaseProjection,
  with: {
    category: categoryBadgeProjection,
    coverMedia: mediaAttachmentProjection,
    media: mediaAttachmentProjection,
    uploadedByUser: userCompactProjection,
  }
} satisfies RelationalProjection<"events">;