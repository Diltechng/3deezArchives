import { UserRole } from "@/shared/constants/enums";
import { EventDto, GetEventsMeta } from "@/shared/contracts/events.contract";
import { CreateEventPayload, EventId, GetEventsQuery, UpdateEventPayload } from "@/shared/schemas";

export interface CreateEventInput {
  data: CreateEventPayload;
  userId: string;
}

export interface GetEventsInput {
  userId: string;
  userRole: UserRole;
  filters: GetEventsQuery;
}

export interface GetOneEventInput {
  eventId: EventId;
  userId: string;
  userRole: UserRole;
}

export interface UpdateOneEventInput {
  eventId: EventId;
  data: UpdateEventPayload;
  userId: string;
  userRole: UserRole;
}

export interface DeleteOneEventInput {
  eventId: EventId;
  userId: string;
  userRole: UserRole;
}

export interface GetEventsOutput {
  events: EventDto[];
  meta: GetEventsMeta;
}