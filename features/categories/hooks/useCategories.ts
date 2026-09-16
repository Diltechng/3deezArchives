import { api } from "@/features/common/lib/api";
import { QUERY_KEYS } from "@/lib/client/query-keys";
import { useQuery } from "@tanstack/react-query"

export function useCategories() {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: async () => {
      const response = await api.get("/gallery/categories");

      return response.data;
    }
  });
}