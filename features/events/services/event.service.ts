import { api } from "@/features/common/lib/api";
import { EntityId } from "@/shared/contracts/common.contract";
import { DeleteEventByIdResponse, GetEventByIdResponse, GetEventsResponse } from "@/shared/contracts/events.contract";
import { CreateEventPayload } from "@/shared/schemas";

interface GetEventsQueryParams {
  limit: number;
  page: number;
  search?: string;
  categorySlug?: string;
  date?: {
    to: string | undefined;
    from: string | undefined;
  };
  sortBy?: string;
  visibility?: string;
}

export const eventsService = {
  async getEvents({ limit, page, search, categorySlug, date, sortBy, visibility }: GetEventsQueryParams) {
    const searchParams = new URLSearchParams({
      limit: String(limit),
      page: String(page),
    });

    if (search) {
      searchParams.set("search", search);
    }

    if (categorySlug &&  categorySlug !== "all") {
      searchParams.set("category", categorySlug);
    }

    if (date?.from) {
      searchParams.set("from", date.from);
    }

    if (date?.to) {
      searchParams.set("to", date.to);
    }

    const response = await api.get<GetEventsResponse>(`/gallery/events?${searchParams}`);

    return response.data;
  },

  async getEventById(id: EntityId) {
    const response = await api.get<GetEventByIdResponse>(`/gallery/events/${id}`);

    return response.data;
  },

  async createEvent(data: CreateEventPayload) {
    const response = await api.post("/gallery/events", data);

    return response.data;
  },

  async updateEventById(id: EntityId, data: CreateEventPayload) {
    const response = await api.patch(`/gallery/events/${id}`, data);

    return response;
  },

  async deleteEventById(id: EntityId) {
    const response = await api.delete<DeleteEventByIdResponse>(`/gallery/events/${id}`);

    return response.data;
  }
}