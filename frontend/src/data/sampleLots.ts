import type { Lot } from "@/types/Lot";


const now =
  new Date()
  .toISOString();



export const sampleLots: Lot[] = [


{
  id:1,


  lotNumber:"AUG01",


  lotStartDate:"2026-08-01",


  quality:"DD 5MM",


  number:"101",


  percentage:"98%",


  quantity:500,


  qrCode:"LOT:AUG01",



  status:"Created",


  createdAt:now,

  updatedAt:now,

},




{
  id:2,


  lotNumber:"AUG02",


  lotStartDate:"2026-08-01",


  quality:"SH 8MM",


  number:"102",


  percentage:"95%",


  quantity:350,


  qrCode:"LOT:AUG02",



  status:"Created",


  createdAt:now,

  updatedAt:now,

},




{
  id:3,


  lotNumber:"AUG03",


  lotStartDate:"2026-08-02",


  quality:"DIALIT 10MM ABP",


  number:"103",


  percentage:"99%",


  quantity:650,


  qrCode:"LOT:AUG03",



  status:"Created",


  createdAt:now,

  updatedAt:now,

},


];