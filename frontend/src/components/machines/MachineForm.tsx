import { useEffect, useState } from "react";

import type { Machine } from "@/types/Machine";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";



type Props = {

  editingMachine?: Machine | null;

  onSave: (machine: Machine) => void;

};





const sliderMachines = [

"A1","A2","A3","A4","A5","A6","A7","A8","A9","A10",

"B1","B2","B3","B4","B5","B6","B7","B8","B9","B10",

"C1","C2","C3","C4","C5","C6","C7","C8","C9","C10",

"D1","D2","D3","D4","D5","D6","D7","D8","D9","D10",

"E1","E2","E3","E4","E5","E6","E7","E8","E9","E10",

"F1","F2","F3","F4","F5","F6","F7","F8","F9","F10"

];





const cutterMachines = [

"A1","A2","A3","A4","A5","A6","A7","A8","A9","A10",

"B1","B2","B3","B4","B5","B6","B7","B8","B9","B10",

"C1","C2","C3","C4","C5","C6","C7","C8","C9","C10",

"D1","D2","D3","D4","D5","D6","D7","D8","D9","D10",

"E1","E2","E3","E4","E5","E6","E7","E8","E9","E10",

"F1","F2","F3","F4","F5","F6","F7","F8","F9","F10",

"G1","G2","G3","G4","G5","G6","G7","G8","G9","G10"

];







function MachineForm({

editingMachine,

onSave,

}:Props){





const [form,setForm] = useState<any>({

  id:Date.now(),

  machineNo:"A1",

  type:"Slider",

  status:"Active"

});








useEffect(()=>{


 if(editingMachine){

   setForm(editingMachine);

 }


},[editingMachine]);








const update=(

field:string,

value:string

)=>{


 setForm((prev:any)=>({

   ...prev,

   [field]:value

 }));



};









const submit=(e:React.FormEvent)=>{


 e.preventDefault();


 onSave(form);


};







const machines =

form.type==="Slider"

?

sliderMachines

:

cutterMachines;







return (

<form

onSubmit={submit}

className="space-y-5"

>



<div>


<Label>
Machine Type
</Label>


<select

className="h-10 w-full rounded-md border px-3"

value={form.type}

onChange={(e)=>

update(

"type",

e.target.value

)

}

>


<option value="Slider">

Slider

</option>


<option value="Cutter">

Cutter

</option>


</select>


</div>







<div>


<Label>
Machine No
</Label>


<select

className="h-10 w-full rounded-md border px-3"

value={form.machineNo}

onChange={(e)=>

update(

"machineNo",

e.target.value

)

}

>


{

machines.map((machine)=>(


<option

key={machine}

value={machine}

>

{machine}

</option>


))

}


</select>


</div>







<div>


<Label>
Status
</Label>


<select

className="h-10 w-full rounded-md border px-3"

value={form.status}

onChange={(e)=>

update(

"status",

e.target.value

)

}

>


<option value="Active">
Active
</option>


<option value="Inactive">
Inactive
</option>


</select>


</div>







<div className="flex justify-end pt-3">


<Button type="submit">


{

editingMachine

?

"Update Machine"

:

"Add Machine"

}


</Button>


</div>






</form>

);


}



export default MachineForm;