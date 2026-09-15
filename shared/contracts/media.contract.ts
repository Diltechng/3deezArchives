import { EntityId } from "./common.contract";

export class EventMediaDto {
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

export class EventCoverMediaSummaryDto {
  constructor(
    public readonly id: EntityId,
    public readonly secureUrl: string,
  ) {}
}

export class EventMediaSummaryDto {
  constructor(
    public readonly id: EntityId,
  ) {}
}