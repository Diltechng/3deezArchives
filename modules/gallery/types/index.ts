import { PostVisibility, UserRole } from "@/shared/constants/enums";
import {
  PostIdInput,
  CreatePostInput,
  UpdatePostInput,
  GetPostsQueryInput,
} from "@/shared/schemas";
import { Pagination } from "@/shared/types/pagination";


export interface UploadFileInput {
  file: File,
  userId: string;
  postId?: string;
}

export interface DeleteOneFileInput {
  mediaId: string;
  userId: string;
  postId?: string;
}

export interface DeleteFilesInput {
  mediaIds: string[];
  userId: string;
}

export interface UpdateOneFileInput {
  mediaId: string;
  userId: string;
  data: {

  }
}

export interface CreateNewPostInput {
  data: CreatePostInput;
  userId: string;
}

export interface GetPostsInput {
  userId: string;
  userRole: UserRole;
  filters: GetPostsQueryInput;
}

export interface GetOnePostInput {
  postId: PostIdInput;
  userId: string;
  userRole: UserRole;
}

export interface UpdateOnePostInput {
  postId: PostIdInput;
  data: UpdatePostInput;
  userId: string;
  userRole: UserRole;
}

export interface DeleteOnePostInput {
  postId: PostIdInput;
  userId: string;
  userRole: UserRole;
}

export interface PostSummary {
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

export interface GetPostsOutput {
  posts: PostSummary[];
  meta: GetPostsMeta;
}