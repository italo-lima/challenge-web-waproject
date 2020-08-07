export default interface IProduct {
  id?: number;
  name: string;
  description: string;
  amount: number;
  value: number;
  
  created_at: Date;
  updated_at: Date;
}