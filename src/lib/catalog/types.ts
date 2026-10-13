// Mirrors the API contract in btq-backend/ARCHITECTURE.md §4. Money is whole RWF.

export type ProductImage = {
  url: string;
  alt: string;
  color: string | null;
};

export type ProductColor = {
  name: string;
  hex: string | null;
  is_available: boolean;
};

export type ProductListItem = {
  slug: string;
  code: string;
  name: string;
  price: number;
  sale_price: number | null;
  effective_price: number;
  is_on_sale: boolean;
  is_sold_out: boolean;
  images: ProductImage[];
  colors: ProductColor[];
};

export type CategoryRef = { slug: string; name: string };

export type Variant = { size: string; color: string; is_available: boolean };

export type ProductDetail = ProductListItem & {
  description: string;
  material: string;
  fit_note: string;
  categories: (CategoryRef & { parent: CategoryRef | null })[];
  tags: TagRef[];
  sizes: string[];
  variants: Variant[];
};

export type Paginated<T> = {
  count: number;
  page: number;
  page_size: number;
  items: T[];
};

export type Category = {
  slug: string;
  name: string;
  cover_image: string | null;
  show_on_home: boolean;
  position: number;
  product_count: number;
  children: Category[];
};

export type TagRef = { slug: string; name: string };
export type Tag = TagRef & { product_count: number };

export type Color = { name: string; hex: string | null };

export type Collection = { slug: string; name: string; description: string };
export type CollectionDetail = Collection & Paginated<ProductListItem>;

export type SiteSettings = {
  whatsapp_number: string;
  whatsapp_template: string;
  whatsapp_restock_template: string;
  phone: string;
  email: string;
  address: string;
  socials: { instagram: string; tiktok: string; x: string; facebook: string };
};

export type ProductSort = "newest" | "price_asc" | "price_desc";

export type ProductFilters = {
  category?: string;
  tag: string[];
  size: string[];
  color: string[];
  min_price?: number;
  max_price?: number;
  on_sale: boolean;
  in_stock: boolean;
  q?: string;
  sort: ProductSort;
  page: number;
  page_size?: number;
};
