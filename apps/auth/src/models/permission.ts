type Permission = {
  id: number;
  read: boolean | null;
  write: boolean | null;
  view: boolean | null;
  update: boolean | null;
  delete: boolean | null;
  print: boolean | null;
  report: boolean | null;
  menuId: number;
  usuarioId: number;
};
