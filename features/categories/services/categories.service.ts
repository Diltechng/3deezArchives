import { api } from "@/features/common/lib/api";
import { GetCategoriesResponse } from "@/shared/contracts/categories.contract";

const categoriesService = {
  getCategories: async () => {
    const response = await api.get<GetCategoriesResponse>("/gallery/categories");

    return response.data;
  }
}

export { categoriesService };