export type NavLink = { label: string; href: string };
export type NavCategory = NavLink & { children: NavLink[] };
