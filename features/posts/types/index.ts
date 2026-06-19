export interface GalleryPost {
  id: string;
  title: string;
  dateOfMoment: string;
  coverMedia: {
    secureUrl: string;
  }
  uploadedByUser: {
    name: string;
  }
  category: {
    name: string;
  }
}

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