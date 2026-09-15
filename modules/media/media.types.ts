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