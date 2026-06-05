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