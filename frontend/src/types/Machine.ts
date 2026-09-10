export type MachineType =
  | "Normal Machine"
  | "Cutter Machine";


export interface Machine {

  id: number;


  // Machine type
  type: MachineType;


  // Machine number
  machineNo: string;


  // Row name (A,B,C...)
  row: string;


  // Column number (1-10)
  number: number;


  status:
    | "Active"
    | "Inactive";


  createdAt: string;

  updatedAt: string;

}