import { SerializeDates } from "@/shared/types/api";
import { PostDto } from "@/shared/contracts/posts.contract";
import { PostVisibility } from "@/shared/constants/enums";

export type GalleryEvent = SerializeDates<PostDto>;

export interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
}

export interface MediaUploadItem {
  fileName: string;
  status: "uploading" | "ready" | "failed";
  local: {
    id: string;
    url: string;
  }
  remote: {
    id: string;
    url: string;
  } | null;
}

export interface Media {
  id: string;
  secureUrl: string;
};

export interface EventFormInitialData {
  id: string;
  title: string;
  description: string | undefined;
  visibility: PostVisibility;
  dateOfMoment: string;
  categoryId: string | undefined;
  tags: string[] | undefined;
  coverMedia: Media;
  media: Media[];
};