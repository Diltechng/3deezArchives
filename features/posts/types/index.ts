import { SerializeDates } from "@/shared/types/api";
import { PostListItem } from "@/shared/contracts/posts.contract";
import { PostVisibility } from "@/shared/constants/enums";

export type GalleryPost = SerializeDates<PostListItem>;

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

export interface PostFormInitialData {
  id: string;
  title: string;
  description: string;
  visibility: PostVisibility;
  dateOfMoment: string;
  categoryId: string;
  tags: string[];
  coverMedia: Media;
  media: Media[];
};