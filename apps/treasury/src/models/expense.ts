export interface ExpenseReq {
  date: string;
  supplier: string;
  supplierId: string;
  concept: string;
  amount: number;
  observation: string;
  heading: number;
}

export type Egresos = {
  id: number;
  status: boolean;
  date: Date;
  supplierId: string | null;
  supplier: string | null;
  concept: string;
  amount: number;
  observation: string | null;
  headingId: number;
};
