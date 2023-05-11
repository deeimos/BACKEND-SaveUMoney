export interface ICost {
  userId: string;
  billId: string;
  categoryId: string;
  date:  Date;
  value: number;
  description: string;
}