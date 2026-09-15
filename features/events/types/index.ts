import { SerializeDates } from "@/shared/types/api";
import { EventDto } from "@/shared/contracts/events.contract";
import { EventVisibility } from "@/shared/constants/enums";

export type GalleryEvent = SerializeDates<EventDto>;

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
  visibility: EventVisibility;
  dateOfMoment: string;
  categoryId: string | undefined;
  tags: string[] | undefined;
  coverMedia: Media;
  media: Media[];
};