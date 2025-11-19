type Menu = {
  id: number;
  appId: number;
  title: string;
  endpoint: string;
  frontPath: string;
  status: boolean | null;
  description: string | null;
  ancestorId: number | null;
  read: boolean | null;
  write: boolean | null;
  view: boolean | null;
  icon: string | null;
};
