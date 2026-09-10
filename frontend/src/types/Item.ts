export interface Item {

  _id?: string;

  quality: string;

  number: string;

  percentage: number;

  category: string;

  status:
    | "Active"
    | "Inactive";

  createdAt?: string;

  updatedAt?: string;

}