import "server-only";
import { apiGet } from "./client";
import type { Category, Color, Tag } from "./types";

export function listCategories() {
  return apiGet<Category[]>("/categories");
}

export function listTags() {
  return apiGet<Tag[]>("/tags");
}

export function listSizes() {
  return apiGet<string[]>("/sizes");
}

export function listColors() {
  return apiGet<Color[]>("/colors");
}

/** Finds a category anywhere in the two-level tree, with its parent if any. */
export function findCategory(categories: Category[], slug: string) {
  for (const category of categories) {
    if (category.slug === slug) return { category, parent: null };
    const child = category.children.find((c) => c.slug === slug);
    if (child) return { category: child, parent: category };
  }
  return null;
}
