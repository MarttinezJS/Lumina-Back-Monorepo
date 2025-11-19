import { Actions } from "@lumina/prisma";

export type Logs = {
  action: Actions;
  endpoint: string;
  resp: string;
  username: string;
  persist?: boolean;
};
