import { EntityId } from "./common.contract";

export class PostCategoryDto {
  constructor (
    public readonly id: EntityId,
    public readonly name: string,
    public readonly description: string,
    public readonly slug: string,
  ) {}
}