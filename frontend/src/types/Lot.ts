import type { ItemCategory } from "./ItemCategory";



export interface Lot {

  id?:number;

  _id?:string;



  // Create Lot Fields

  lotNumber:string;


  // Lot Creation Date

  lotStartDate:string;


  // Barcode Scan Date

  scanDate?:string;



  quality:string;


  itemId?:string;


  number:string;


  percentage:string;


  quantity:number | "";


  qrCode?:string;


  barcode?:string;





  // Filled after Barcode Scan

  lotEndDate?:string;



  machineNo?:string;



  operatorName?:string;



  cutterMachineNo?:string;



  cutterName?:string;



  cutType?:string;





  category?:ItemCategory;





  // Lot Status

  status:

    | "Created"

    | "Running"

    | "Ready Packing"

    | "Completed";





  remarks?:string;





  createdAt?:string;


  updatedAt?:string;


}