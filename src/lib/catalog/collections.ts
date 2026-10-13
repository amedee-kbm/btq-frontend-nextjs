import "server-only";
import { apiGet } from "./client";
import { PAGE_SIZE } from "./filters";
import type { Collection, CollectionDetail } from "./types";

export function listCollections() {
  return apiGet<Collection[]>("/collections");
}

export function getCollection(slug: string, page = 1, pageSize = PAGE_SIZE) {
  return apiGet<CollectionDetail>(
    `/collections/${encodeURIComponent(slug)}`,
    new URLSearchParams({ page: String(page), page_size: String(pageSize) }),
  );
}
