export type User = {
  password: string;
  email: string;
  username: string;
  id: number;
  firstName: string;
  lastName: string;
  changePassword: boolean | null;
  active: boolean | null;
};
