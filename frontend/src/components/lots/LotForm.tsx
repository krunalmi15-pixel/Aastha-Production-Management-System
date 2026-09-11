import { useEffect, useState } from "react";
import Barcode from "react-barcode";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { lotAPI, employeeAPI } from "@/services/api";
import type { Lot } from "@/types/Lot";

type Props = {
  editingLot?: Lot | null;
  onSave: (lot: Lot) => void;
};

function LotForm({ editingLot, onSave }: Props) {
  const [items, setItems] = useState<any[]>([]);

  const [form, setForm] = useState<Lot>({
    lotNumber: "",
    lotStartDate: "",
    quality: "",
    number: "",
    percentage: "",
    quantity: "",
    barcode: "",
    status: "Created"
  });

  const loadNextNumber = async () => {
    try {
      const data = await lotAPI.nextNumber();

      setForm((prev) => ({
        ...prev,
        lotNumber: data.lotNumber,
        barcode: data.barcode,
      }));
    } catch (error) {
      console.error(
        "Failed to load lot number",
        error
      );
    }
  };

  useEffect(() => {
    if (!editingLot) {
      loadNextNumber();
    }
  }, [editingLot]);

  const loadItems = async () => {
    try {
      const data = await employeeAPI.items.getAll();
      setItems(data);
    } catch (error) {
      console.error("Failed to load items", error);
    }
  };

  useEffect(() => {
    loadItems();

    if (editingLot) {
      setForm({
        ...editingLot,
        lotStartDate:
          editingLot.lotStartDate || "",
      });
    } else {
      setForm((prev) => ({
        ...prev,
        lotStartDate: new Date().toISOString().split("T")[0],
        quality: "",
        number: "",
        percentage: "",
        quantity: "",
        status: "Created"
      }));
    }
  }, [editingLot]);

  const update = (field: keyof Lot, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.itemId ||
      !form.quality ||
      !form.number ||
      !form.percentage ||
      !form.quantity ||
      !form.lotStartDate
    ) {
      alert("Please fill all lot details before saving");
      return;
    }

    try {
      let savedLot: Lot;

      const payload = {
        itemId: form.itemId,
        startDate: form.lotStartDate || new Date().toISOString().split("T")[0],
        quality: form.quality,
        number: form.number,
        percentage: Number(form.percentage),
        quantity: Number(form.quantity),
      };

      if (editingLot?._id) {
        savedLot = await lotAPI.update(editingLot._id, payload);
      } else {
        savedLot = await lotAPI.create(payload);
      }

      onSave(savedLot);

      setForm((prev) => ({
        ...prev,
        lotNumber: savedLot.lotNumber,
        barcode: savedLot.barcode,
        status: savedLot.status,
      }));

      alert(editingLot ? "Lot Updated Successfully" : "Lot Created Successfully");
    } catch (error) {
      console.error("Lot operation failed", error);
      alert("Failed to save lot");
    }
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-2 gap-5">
      <div>
        <Label>Lot Number</Label>
        <Input value={form.lotNumber} readOnly placeholder="Auto-generated" />
      </div>

      <div>
        <Label>Lot Start Date</Label>
        <Input
          type="date"
          value={form.lotStartDate || ""}
          onChange={(e) => update("lotStartDate", e.target.value)}
        />
      </div>

      <div>
        <Label>Quality</Label>
        <select
          className="h-10 w-full rounded-md border px-3"
          value={form.itemId || ""}
          onChange={(e) => {
            const selected = items.find((item) => item._id === e.target.value);
            update("itemId", selected?._id || "");
            update("quality", selected?.quality || "");
          }}
        >
          <option value="">Select Quality</option>
          {items.map((item) => (
            <option key={item._id} value={item._id}>
              {item.quality}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Number</Label>
        <Input
          value={form.number || ""}
          onChange={(e) => update("number", e.target.value)}
        />
      </div>

      <div>
        <Label>Percentage</Label>
        <Input
          value={form.percentage ? `${form.percentage}%` : ""}
          onChange={(e) => update("percentage", e.target.value.replace("%", ""))}
        />
      </div>

      <div>
        <Label>Quantity</Label>
        <Input
          type="number"
          value={form.quantity || ""}
          onChange={(e) =>
            update("quantity", e.target.value === "" ? "" : Number(e.target.value))
          }
        />
      </div>

      <div className="col-span-2">
        <Label>Barcode</Label>
        <div className="flex justify-center mt-2">
          <Barcode
            value={form.barcode ? form.barcode : (form.lotNumber ? `LOT:${form.lotNumber}` : "PENDING")}
            height={45}
            width={1.5}
            displayValue={true}
          />
        </div>
      </div>

      <div className="col-span-2 flex justify-end">
        <Button type="submit">
          {editingLot ? "Update Lot" : "Create Lot"}
        </Button>
      </div>
    </form>
  );
}

export default LotForm;