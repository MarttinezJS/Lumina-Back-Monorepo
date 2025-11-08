type Logs = {
  id: number;
  userId: number;
  endpoint: string;
  action: Actions;
  date: Date | null;
  persist: boolean | null;
  resp: string;
};

type Actions = "guardar" | "editar" | "eliminar" | "consultar";
