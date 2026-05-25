import { UserRole } from "@/shared/constants/enums";
import {
  PostIdInput,
  CreatePostInput,
  UpdatePostInput,
} from "@/shared/schemas";


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
}

export interface UpdateOnePostInput {
  postId: PostIdInput;
  data: UpdatePostInput,
  userId: string;
  userRole: UserRole;
}

export interface DeleteOnePostInput {
  postId: PostIdInput;
  userId: string;
  userRole: UserRole;
}