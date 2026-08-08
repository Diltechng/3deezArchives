import { PostVisibility } from "../constants/enums";
import { PostCategoryDto } from "./categories.contract";
import { EntityId, TPagination, TResponse } from "./common.contract";
import { PostCoverMediaSummaryDto, PostMediaDto, PostMediaSummaryDto } from "./media.contract";
import { PostUserDto } from "./users.contract";

export class PostListItem {
  constructor(
    public readonly id: EntityId,
    public readonly visibility: PostVisibility,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly title: string,
    public readonly description: string | null,
    public readonly tags: string[] | null,
    public readonly dateOfMoment: Date,
    public readonly coverMedia: PostCoverMediaSummaryDto | null,
    public readonly media: PostMediaSummaryDto[],
    public readonly category: PostCategoryDto | null,
    public readonly uploadedByUser: PostUserDto | null,
  ) {}
}

export class PostDto {
  constructor(
    public readonly id: EntityId,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly title: string,
    public readonly description: string | null,
    public readonly tags: string[] | null,
    public readonly visibility: PostVisibility,
    public readonly dateOfMoment: Date,
    public readonly coverMedia: PostMediaDto | null,
    public readonly media: PostMediaDto[],
    public readonly category: PostCategoryDto | null,
    public readonly uploadedByUser: PostUserDto | null,
  ) {}
}

export class GetPostsMeta {
  constructor(
    public readonly pagination: TPagination,
  ) {}
}

export class DeletedPostDto {
  constructor(
    public readonly id: string,
    public readonly media: PostMediaSummaryDto[],
  ) {}
};

export class UpdatedPostDto {
  constructor(
    public readonly id: string,
  ) {}
}

// Api Responses

export type GetPostByIdResponse = TResponse<PostDto>;

export type GetPostsResponse = TResponse<PostDto[], GetPostsMeta>;

export type DeletePostByIdResponse = TResponse<DeletedPostDto>;

export type UpdatePostByIdResponse = TResponse<UpdatedPostDto>;