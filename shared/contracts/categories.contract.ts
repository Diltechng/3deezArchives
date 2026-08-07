import { EntityId, TResponse } from "./common.contract";

export class PostCategoryDto {
  constructor (
    public readonly id: EntityId,
    public readonly name: string,
    public readonly description: string,
    public readonly slug: string,
  ) {}
}

export class CategoryDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly description: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}

export type GetCategoriesResponse = TResponse<CategoryDto[]>;