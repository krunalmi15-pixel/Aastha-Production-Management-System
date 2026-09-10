import { useEffect, useState } from "react";

import { employeeAPI } from "@/services/api";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  ChevronDown,
  ChevronRight,
  Plus,
  Cpu,
  Trash2,
} from "lucide-react";

type Machine = {
  _id?: string;
  machineNo: string;
  type: "Slider" | "Cutter";
  status: "Active" | "Inactive";
};

function Machines() {
  const [machines, setMachines] = useState<Machine[]>([]);

  const [productionOpen, setProductionOpen] = useState(false);
  const [machineListOpen, setMachineListOpen] = useState(false);
  const [addMachineOpen, setAddMachineOpen] = useState(false);

  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);

  const [machineType, setMachineType] = useState<"Slider" | "Cutter">("Slider");
  const [machineNo, setMachineNo] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [tillDate, setTillDate] = useState("");

  const [selectedMachine, setSelectedMachine] = useState("");
  const [productionData, setProductionData] = useState<any>(null);
  const [loadingProduction, setLoadingProduction] = useState(false);
  const [search, setSearch] = useState("");

  const loadMachines = async () => {
    const data = await employeeAPI.machines.getAll();
    setMachines(data);
  };

  useEffect(() => {
    loadMachines();
  }, []);

  useEffect(() => {
    if (!selectedMachine) return;
    const loadProduction = async () => {
      try {
        setLoadingProduction(true);
        let url = `http://localhost:5000/api/machines/production/${selectedMachine}`;
        if (fromDate && tillDate) {
          url += `?from=${fromDate}&to=${tillDate}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setProductionData(data);
        setLoadingProduction(false);
      } catch (err) {
        console.log(err);
        setLoadingProduction(false);
      }
    };
    loadProduction();
  }, [selectedMachine, fromDate, tillDate]);

  const saveMachine = async () => {
    const machine = await employeeAPI.machines.create({
      machineNo,
      type: machineType,
      status: "Active",
    });

    setMachines((prev) => [...prev, machine]);

    setMachineNo("");
    setAddMachineOpen(false);
  };

  const updateMachine = async () => {
    if (!editingMachine?._id) return;

    const updated = await employeeAPI.machines.update(editingMachine._id, {
      machineNo,
      type: machineType,
      status: editingMachine.status,
    });

    setMachines((prev) =>
      prev.map((m) =>
        m._id === editingMachine._id
          ? updated || { ...m, machineNo, type: machineType }
          : m
      )
    );

    setEditingMachine(null);
    setMachineNo("");
    setAddMachineOpen(false);
  };

  const deleteMachine = async (id: string) => {
    await employeeAPI.machines.delete(id);

    setMachines((prev) => prev.filter((machine) => machine._id !== id));
  };

  const filteredMachines = machines.filter(
    (m) => m.type === machineType
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Machines</h1>
          <p className="text-muted-foreground mt-2">
            Manage machine production and machine details.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingMachine(null);
            setMachineNo("");
            setAddMachineOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Machine
        </Button>
      </div>

      {addMachineOpen && (
        <Card>
          <CardContent className="p-6 space-y-5">
            <h2 className="text-xl font-semibold">
              {editingMachine ? "Edit Machine" : "Add Machine"}
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label>Machine Type</label>
                <select
                  className="h-10 w-full border rounded-md px-3"
                  value={machineType}
                  onChange={(e) =>
                    setMachineType(e.target.value as "Slider" | "Cutter")
                  }
                >
                  <option value="Slider">Slider</option>
                  <option value="Cutter">Cutter</option>
                </select>
              </div>

              <div>
                <label>Machine No</label>
                <Input
                  value={machineNo}
                  placeholder="S01"
                  onChange={(e) => setMachineNo(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingMachine(null);
                  setAddMachineOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={editingMachine ? updateMachine : saveMachine}>
                {editingMachine ? "Update" : "Save"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <div
          className="flex items-center justify-between p-5 cursor-pointer"
          onClick={() => setProductionOpen(!productionOpen)}
        >
          <div className="flex gap-3 items-center">
            <Cpu />
            <h2 className="text-xl font-semibold">
              Machine Production Summary
            </h2>
          </div>

          {productionOpen ? <ChevronDown /> : <ChevronRight />}
        </div>

        {productionOpen && (
          <CardContent>
            <div className="grid md:grid-cols-3 gap-5">
              <div>
                <label>From Date</label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div>
                <label>Till Date</label>
                <Input
                  type="date"
                  value={tillDate}
                  onChange={(e) => setTillDate(e.target.value)}
                />
              </div>

              <div>
                <label>Machine Type</label>
                <select
                  className="h-10 w-full border rounded-md px-3"
                  value={machineType}
                  onChange={(e) => {
                    setMachineType(e.target.value as "Slider" | "Cutter");
                    setSelectedMachine("");
                    setProductionData(null);
                  }}
                >
                  <option value="Slider">Slider</option>
                  <option value="Cutter">Cutter</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="font-semibold">Select Machine</label>
              <select
                className="h-10 w-full border rounded-md px-3 mt-2"
                value={selectedMachine}
                onChange={(e) => {
                  setSelectedMachine(e.target.value);
                  setProductionData(null);
                }}
              >
                <option value="">Select Machine</option>
                {filteredMachines.map((machine) => (
                  <option key={machine._id} value={machine._id}>
                    {machine.machineNo}
                  </option>
                ))}
              </select>
            </div>

            {selectedMachine && (
              <Card className="mt-6">
                <CardContent className="p-6">

                  <h2 className="text-xl font-bold mb-5">
                    Machine Production Summary
                  </h2>


                  <div className="grid md:grid-cols-3 gap-5">

                    <div className="border rounded-lg p-5">
                      <p className="text-sm text-muted-foreground">
                        Machine
                      </p>

                      <h3 className="text-2xl font-bold mt-2">
                        {
                          machines.find(
                            (m)=>m._id === selectedMachine
                          )?.machineNo
                        }
                      </h3>
                    </div>



                    <div className="border rounded-lg p-5">

                      <p className="text-sm text-muted-foreground">
                        Total Lots
                      </p>

                      <h3 className="text-2xl font-bold mt-2">
                        {loadingProduction ? "Loading..." : productionData?.totalLots || 0}
                      </h3>

                    </div>



                    <div className="border rounded-lg p-5">

                      <p className="text-sm text-muted-foreground">
                        Total Production
                      </p>

                      <h3 className="text-2xl font-bold mt-2">
                        {loadingProduction ? "Loading..." : productionData?.totalProduction || 0}
                      </h3>

                    </div>


                  </div>


                </CardContent>
              </Card>
            )}
          </CardContent>
        )}
      </Card>

      <Card>
        <div
          className="flex items-center justify-between p-5 cursor-pointer"
          onClick={() => setMachineListOpen(!machineListOpen)}
        >
          <h2 className="text-xl font-semibold">Machine List</h2>

          {machineListOpen ? <ChevronDown /> : <ChevronRight />}
        </div>

        {machineListOpen && (
          <CardContent>
            <Input
              placeholder="Search machine..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="border rounded-md mt-4">
              <div className="grid grid-cols-4 p-3 border-b font-semibold">
                <span>No</span>
                <span>Type</span>
                <span>Status</span>
                <span>Action</span>
              </div>

              {machines
                .filter((m) =>
                  m.machineNo.toLowerCase().includes(search.toLowerCase())
                )
                .map((machine) => (
                  <div
                    key={machine._id}
                    className="grid grid-cols-4 p-3 border-b items-center"
                  >
                    <span>{machine.machineNo}</span>
                    <span>{machine.type}</span>
                    <span>{machine.status}</span>

                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          setEditingMachine(machine);
                          setMachineNo(machine.machineNo);
                          setMachineType(machine.type);
                          setAddMachineOpen(true);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteMachine(machine._id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

export default Machines;