import { PaginationQuery } from "@/shared/schemas";

function getPagination(query: PaginationQuery) {
  const page = query.page;
  const limit = query.limit;
  const offset = (query.page - 1) * limit;

  return { page, limit, offset };
}

function buildPaginationMeta(page: number, limit: number, count: number) {
  const totalPages = Math.ceil(count / limit)

  return {
    page,
    limit,
    total: count,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  }
}

export {
  getPagination,
  buildPaginationMeta,
}