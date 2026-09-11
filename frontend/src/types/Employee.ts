export interface Employee {

  id?: number;

  _id?: string;


  name: string;

  phone: string;

  address: string;

  joiningDate: string;

  aadhaar?: string;


  accountNumber?: string;

  bankName?: string;

  branch?: string;

  ifscCode?: string;

  role:
  | "Operator"
  | "Cutter";


  status: 
    | "Active"
    | "Inactive";

}