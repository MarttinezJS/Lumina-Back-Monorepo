type Ingresos = {
  id: number;
  headingId: number;
  date: Date;
  status: boolean;
  observation: string | null;
  concept: string;
  amount: number;
  verified: boolean | null;
};
