import { api } from "@/features/common/lib/api";
import { EntityId } from "@/shared/contracts/common.contract";
import { DeletePostByIdResponse, GetPostByIdResponse, GetPostsResponse } from "@/shared/contracts/posts.contract";

interface GetEventsQueryParams {
  limit: number;
  page: number;
  search?: string;
  categorySlug?: string;
  date?: {
    to: string;
    from: string;
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

    const response = await api.get<GetPostsResponse>(`/gallery/posts?${searchParams}`);

    return response.data;
  },

  async getEventById(id: EntityId) {
    const response = await api.get<GetPostByIdResponse>(`/gallery/posts/${id}`);

    return response.data;
  },

  async deleteEventById(id: EntityId) {
    const response = await api.delete<DeletePostByIdResponse>(`/gallery/posts/${id}`);

    return response.data;
  }
}