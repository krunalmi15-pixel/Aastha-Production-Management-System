import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  lotAPI,
  productionAPI,
  machineAPI,
  employeeMasterAPI,
} from "@/services/api";

import type { Lot } from "@/types/Lot";

type Props = {
  lots: Lot[];
  onUpdate: (lot: Lot) => void;
  editingLot?: Lot | null;
};

const cutTypes = ["3 Cut", "4 Cut"];
const statuses = ["Completed"];

function ScanBarcode({ onUpdate, editingLot }: Props) {
  const [barcode, setBarcode] = useState("");
  const [form, setForm] = useState<Lot | null>(null);
  const [existingProduction, setExistingProduction] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);

  // Master Data
  const [machines, setMachines] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  // Selected IDs for Production API Payload
  const [selectedMachineId, setSelectedMachineId] = useState("");
  const [selectedOperatorId, setSelectedOperatorId] = useState("");
  const [selectedCutterMachineId, setSelectedCutterMachineId] = useState("");
  const [selectedCutterOperatorId, setSelectedCutterOperatorId] = useState("");

  // Load Masters
  useEffect(() => {
    const loadMasters = async () => {
      try {
        const machineData = await machineAPI.getAll();
        const employeeData = await employeeMasterAPI.getAll();

        setMachines(machineData);
        console.log("Machines:", machineData);

        setEmployees(employeeData);
        console.log("Employees:", employeeData);
      } catch (error) {
        console.error("Master fetch failed", error);
      }
    };

    loadMasters();
  }, []);

  // Pre-fill form and load existing production details when editing an existing lot
  useEffect(() => {
    const loadExistingProduction = async () => {
      if (!editingLot) return;

      try {
        setBarcode(editingLot.lotNumber || "");
        
        const production = await productionAPI.getByLotId(
          String(editingLot._id)
        );
        console.log("PRODUCTION RESPONSE", production);
        setExistingProduction(production);

        setForm({
          ...editingLot,
          lotStartDate:
            editingLot.lotStartDate || "",
          scanDate:
            editingLot.scanDate ||
            new Date().toISOString().split("T")[0],
          machineNo:
            production?.machineId?.machineNo || "",
          operatorName:
            production?.operatorId?.name || "",
          cutterMachineNo:
            production?.cutterMachineId?.machineNo || "",
          cutterName:
            production?.cutterOperatorId?.name || "",
          cutType:
            production?.cutType || "",
        });

        if (production) {
          setSelectedMachineId(production.machineId || "");
          setSelectedOperatorId(production.operatorId || "");
          setSelectedCutterMachineId(production.cutterMachineId || "");
          setSelectedCutterOperatorId(production.cutterOperatorId || "");
        }
        
        setMessage("");
      } catch (error) {
        console.error("Failed to load existing production data", error);
        setForm({
          ...editingLot,
          lotStartDate: editingLot.lotStartDate || "",
          scanDate: editingLot.scanDate || new Date().toISOString().split("T")[0],
        });
      }
    };

    loadExistingProduction();
  }, [editingLot]);

  const scan = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const value = barcode.trim().toUpperCase();

    if (!value) {
      setMessage("Enter barcode");
      return;
    }

    try {
      const found = await lotAPI.getByBarcode(value);

      if (found) {
        setForm({
          ...found,
          lotStartDate: found.lotStartDate || "",
          scanDate: new Date().toISOString().split("T")[0],
          machineNo: "",
          operatorName: "",
          cutterMachineNo: "",
          cutterName: "",
          cutType: "",
        });
        setMessage("");
      } else {
        setForm(null);
        setMessage("No lot found");
      }
    } catch (error: any) {
      console.log(
        "SCAN ERROR:",
        error.response?.data || error.message
      );
      setForm(null);
      setMessage("No lot found");
    }
  };

  const update = (field: keyof Lot, value: string) => {
    if (!form) return;

    setForm({
      ...form,
      [field]: value,
    });
  };

  const save = async () => {
    if (!form?._id) return;

    if (
      !selectedMachineId ||
      !selectedOperatorId ||
      !selectedCutterMachineId ||
      !selectedCutterOperatorId ||
      !form.cutType ||
      !form.quantity
    ) {
      alert("Please fill all production details before completing the lot");
      return;
    }

    try {
      const existingProductionRecord =
        await productionAPI.getByLotId(String(form._id));
      
      if (existingProductionRecord && form.status !== "Completed" && !editingLot) {
        alert("Production already completed for this lot");
        return;
      }

      const updatedLot = await lotAPI.update(
        form._id,
        {
          quantity: Number(form.quantity),
          scanDate: form.scanDate,
          status: "Completed",
        }
      );

      if (existingProductionRecord) {

        console.log(
          "UPDATE PRODUCTION",
          existingProductionRecord._id
        );

        await productionAPI.update(existingProductionRecord._id, {
          lotId: form._id,
          lotNumber: form.lotNumber,
          itemId: form.itemId,
          machineId: selectedMachineId,
          operatorId: selectedOperatorId,
          cutterMachineId: selectedCutterMachineId,
          cutterOperatorId: selectedCutterOperatorId,
          cutType: form.cutType,
          scanDate: form.scanDate,
          quantity: Number(form.quantity),
          status: "Completed",
        });
      } else {
        const productionData = {
          lotId: form._id,
          lotNumber: form.lotNumber,
          itemId: form.itemId,
          machineId: selectedMachineId,
          operatorId: selectedOperatorId,
          cutterMachineId: selectedCutterMachineId,
          cutterOperatorId: selectedCutterOperatorId,
          cutType: form.cutType,
          scanDate: form.scanDate,
          quantity: Number(form.quantity),
          status: "Completed",
        };

        if (existingProduction?._id) {
          await productionAPI.update(
            existingProduction._id,
            productionData
          );
        } else {
          console.log("PRODUCTION DATA:", productionData);
          await productionAPI.create(
            productionData
          );
        }
      }

      onUpdate(updatedLot);
      alert("Production Completed Successfully");
    } catch (error: any) {
      console.log(
        "SCAN ERROR:",
        error.response?.data || error.message
      );
      alert("Failed to save production");
    }
  };

  const startCamera = () => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: {
          width: 220,
          height: 220,
        },
        aspectRatio: 1,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        setBarcode(decodedText);
        scanner.clear();
        setCameraOpen(false);
      },
      (errorMessage) => {
        console.log(errorMessage);
      }
    );
  };

  return (
    <div className="space-y-6">
      <form onSubmit={scan}>
        <Label>Scan Barcode</Label>
        <div className="flex gap-3 mt-2">
          <Input
            autoFocus
            placeholder="Scan barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                scan(e);
              }
            }}
          />

          <Button type="submit">
            Scan
          </Button>

          <Button
            type="button"
            onClick={() => {
              setCameraOpen(true);
              setTimeout(startCamera, 100);
            }}
          >
            Camera
          </Button>
        </div>
      </form>

      {cameraOpen && (
        <div className="mt-4 border rounded-lg p-4">
          <div
            id="reader"
            className="w-full max-w-md mx-auto overflow-hidden rounded-lg"
          ></div>

          <Button
            type="button"
            onClick={() => setCameraOpen(false)}
          >
            Close Camera
          </Button>
        </div>
      )}

      {message && <p className="text-red-500">{message}</p>}

      {form && (
        <div className="grid grid-cols-2 gap-5 border rounded-lg p-5">
          <div>
            <Label>Lot Number</Label>
            <Input value={form.lotNumber} readOnly />
          </div>

          <div>
            <Label>Lot Start Date</Label>
            <Input value={form.lotStartDate || ""} readOnly />
          </div>

          <div>
            <Label>Scan Date</Label>
            <Input value={form.scanDate || ""} readOnly />
          </div>

          <div>
            <Label>Quality</Label>
            <Input value={form.quality} readOnly />
          </div>

          <div>
            <Label>Number</Label>
            <Input value={form.number} readOnly />
          </div>

          <div>
            <Label>Percentage</Label>
            <Input value={`${form.percentage}%`} readOnly />
          </div>

          <div>
            <Label>Quantity</Label>
            <Input value={form.quantity} readOnly />
          </div>

          {/* MACHINE FROM MASTER */}
          <div>
            <Label>Machine No</Label>
            <select
              className="h-10 w-full rounded-md border px-3"
              value={form.machineNo || ""}
              onChange={(e) => {
                const selected = machines.find(
                  (item) => item.machineNo === e.target.value && item.type === "Slider"
                );
                setSelectedMachineId(selected?._id || "");
                update("machineNo", e.target.value);
              }}
            >
              <option value="">Select Machine</option>
              {machines
                .filter((item) => item.type === "Slider")
                .map((item) => (
                  <option key={item._id} value={item.machineNo}>
                    {item.machineNo}
                  </option>
                ))}
            </select>
          </div>

          {/* EMPLOYEE FROM MASTER */}
          <div>
            <Label>Operator Name</Label>
            <select
              className="h-10 w-full rounded-md border px-3"
              value={form.operatorName || ""}
              onChange={(e) => {
                const selected = employees.find(
                  (item) => item.name === e.target.value
                );
                setSelectedOperatorId(selected?._id || "");
                update("operatorName", e.target.value);
              }}
            >
              <option value="">
                Select Operator
              </option>

              {employees
                .filter((item) => item.role === "Operator")
                .map((item) => (
                  <option key={item._id} value={item.name}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>

          {/* CUTTER MACHINE FROM MASTER */}
          <div>
            <Label>Cutter Machine No</Label>
            <select
              className="h-10 w-full rounded-md border px-3"
              value={form.cutterMachineNo || ""}
              onChange={(e) => {
                const selected = machines.find(
                  (item) => item.machineNo === e.target.value && item.type === "Cutter"
                );
                setSelectedCutterMachineId(selected?._id || "");
                update("cutterMachineNo", e.target.value);
              }}
            >
              <option value="">Select Cutter Machine</option>
              {machines
                .filter((item) => item.type === "Cutter")
                .map((item) => (
                  <option key={item._id} value={item.machineNo}>
                    {item.machineNo}
                  </option>
                ))}
            </select>
          </div>

          {/* CUTTER OPERATOR FROM MASTER */}
          <div>
            <Label>Cutter Name</Label>
            <select
              className="h-10 w-full rounded-md border px-3"
              value={form.cutterName || ""}
              onChange={(e) => {
                const selected = employees.find(
                  (item) => item.name === e.target.value
                );
                setSelectedCutterOperatorId(selected?._id || "");
                update("cutterName", e.target.value);
              }}
            >
              <option value="">
                Select Cutter
              </option>

              {employees
                .filter((item) => item.role === "Cutter")
                .map((item) => (
                  <option key={item._id} value={item.name}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <Label>Cut Type</Label>
            <select
              className="h-10 w-full rounded-md border px-3"
              value={form.cutType || ""}
              onChange={(e) => update("cutType", e.target.value)}
            >
              <option value="">Select Cut Type</option>
              {cutTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Status</Label>
            <select
              className="h-10 w-full rounded-md border px-3"
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2 flex justify-end">
            <Button type="button" onClick={save}>
              Update Lot
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScanBarcode;