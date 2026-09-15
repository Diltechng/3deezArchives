import { UserRole } from "@/shared/constants/enums";
import {
  EventId,
  CreateEventPayload,
  UpdatePostInput,
  GetPostsQueryInput,
} from "@/shared/schemas";
import { GetPostsMeta, PostDto } from "@/shared/contracts/posts.contract";


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
  data: CreateEventPayload;
  userId: string;
}

export interface GetPostsInput {
  userId: string;
  userRole: UserRole;
  filters: GetPostsQueryInput;
}

export interface GetOnePostInput {
  postId: EventId;
  userId: string;
  userRole: UserRole;
}

export interface UpdateOnePostInput {
  postId: EventId;
  data: UpdatePostInput;
  userId: string;
  userRole: UserRole;
}

export interface DeleteOnePostInput {
  postId: EventId;
  userId: string;
  userRole: UserRole;
}

export interface GetPostsOutput {
  posts: PostDto[];
  meta: GetPostsMeta;
}