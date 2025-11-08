export interface MenuSidebarItem {
  icon: string | null;
  name: string;
  subItems: MenuSubItem[];
}

export interface MenuSubItem {
  name: string;
  path: string;
  new?: boolean;
}
