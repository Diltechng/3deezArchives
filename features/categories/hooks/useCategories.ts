import { api } from "@/features/common/lib/api";
import { useQuery } from "@tanstack/react-query"

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/gallery/categories");

      return response.data;
    }
  });
}