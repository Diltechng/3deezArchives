import { SerializeDates } from "@/shared/types/api";
import { PostListItem } from "@/shared/contracts/posts";

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