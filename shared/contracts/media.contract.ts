import { EntityId } from "./common.contract";

export class PostMediaDto {
  constructor(
    public readonly id: EntityId,
    public readonly createdAt: Date,
    public readonly secureUrl: string,
    public readonly bytes: number,
    public readonly width: number | null,
    public readonly height: number | null,
    public readonly uploadedBy: EntityId | null,
  ) {}
}

export class PostCoverMediaSummaryDto {
  constructor(
    public readonly id: EntityId,
    public readonly secureUrl: string,
  ) {}
}

export class PostMediaSummaryDto {
  constructor(
    public readonly id: EntityId,
  ) {}
}