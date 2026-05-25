import { db } from "@/db";
import { categories } from "@/db/schema";

export const categoriesSelect = {
  id: categories.id,
  name: categories.name,
  slug: categories.slug,
  description: categories.description,
  createdAt: categories.createdAt,
  updatedAt: categories.updatedAt,
}

class CategoriesService {
  async getCategories() {
    const result = await db
      .select(categoriesSelect)
      .from(categories);

    return result;
  }
}

export const categoriesService = new CategoriesService();