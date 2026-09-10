import type { Machine } from "@/types/Machine";



const rowsNormal = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
];


const rowsCutter = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
];





function createMachines(
  rows:string[],
  type:"Normal Machine" | "Cutter Machine"
):Machine[]{


const machines:Machine[] = [];



rows.forEach((row)=>{


for(let i=1;i<=10;i++){


machines.push({

id:
Date.now() +
machines.length,


type,


machineNo:
`${row}${i}`,


row,


number:i,


status:
"Active",


createdAt:
new Date()
.toISOString(),


updatedAt:
new Date()
.toISOString(),

});


}


});


return machines;

}







export const normalMachines =
createMachines(
  rowsNormal,
  "Normal Machine"
);





export const cutterMachines =
createMachines(
  rowsCutter,
  "Cutter Machine"
);





export const allMachines = [

...normalMachines,

...cutterMachines,

];