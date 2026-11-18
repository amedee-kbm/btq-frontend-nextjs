export type NavLink = { label: string; href: string };
export type NavCategoryLink = NavLink & { image: string | null; count: number };
export type NavCategory = NavCategoryLink & { children: NavCategoryLink[] };
