export interface TransactionalIncome {
  date: Date;
  concept: string;
  incomes: IncomeDetail[];
}

interface IncomeDetail {
  heading: number;
  amount: number;
  observation: string;
}
