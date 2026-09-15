import { EventVisibility } from "../constants/enums";
import { EventCategoryDto } from "./categories.contract";
import { EntityId, TPagination, TResponse } from "./common.contract";
import { EventCoverMediaSummaryDto, EventMediaDto, EventMediaSummaryDto } from "./media.contract";
import { EventUserDto } from "./users.contract";

export class EventListItem {
  constructor(
    public readonly id: EntityId,
    public readonly visibility: EventVisibility,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly title: string,
    public readonly description: string | null,
    public readonly tags: string[] | null,
    public readonly dateOfMoment: Date,
    public readonly coverMedia: EventCoverMediaSummaryDto | null,
    public readonly media: EventMediaSummaryDto[],
    public readonly category: EventCategoryDto | null,
    public readonly uploadedByUser: EventUserDto | null,
  ) {}
}

export class EventDto {
  constructor(
    public readonly id: EntityId,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly title: string,
    public readonly description: string | null,
    public readonly tags: string[] | null,
    public readonly visibility: EventVisibility,
    public readonly dateOfMoment: Date,
    public readonly coverMedia: EventMediaDto | null,
    public readonly media: EventMediaDto[],
    public readonly category: EventCategoryDto | null,
    public readonly uploadedByUser: EventUserDto | null,
  ) {}
}

export class GetEventsMeta {
  constructor(
    public readonly pagination: TPagination,
  ) {}
}

export class DeletedEventDto {
  constructor(
    public readonly id: string,
    public readonly media: EventMediaSummaryDto[],
  ) {}
};

export class UpdatedEventDto {
  constructor(
    public readonly id: string,
  ) {}
}

// Api Responses

export type GetEventByIdResponse = TResponse<EventDto>;

export type GetEventsResponse = TResponse<EventDto[], GetEventsMeta>;

export type DeleteEventByIdResponse = TResponse<DeletedEventDto>;

export type UpdateEventByIdResponse = TResponse<UpdatedEventDto>;