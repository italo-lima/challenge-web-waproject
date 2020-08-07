export default interface ISolicitation {
  id?: number;
  name: string;
  description: string;
  amount: number;
  value: number;
  
  created_at: Date;
  updated_at: Date;
}