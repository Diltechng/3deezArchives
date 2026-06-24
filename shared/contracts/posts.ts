import { PostVisibility } from "../constants/enums";
import { ResponseData, SerializeDates } from "../types/api";
import { Pagination } from "../types/pagination";

export interface PostListItem {
  visibility: PostVisibility;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string | null;
  tags: string[] | null;
  dateOfMoment: Date;
  coverMedia: {
    id: string;
    secureUrl: string;
  } | null;
  category: {
    id: string;
    name: string;
    description: string;
    slug: string;
  } | null;
  uploadedByUser: {
    id: string;
    name: string | null;
    role: string;
  } | null;
}

export interface GetPostsMeta {
  pagination: Pagination;
}

export type GetPostsResponse = SerializeDates<ResponseData<PostListItem[], GetPostsMeta>>;