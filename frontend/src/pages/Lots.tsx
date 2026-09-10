import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Plus } from "lucide-react";

import LotForm from "@/components/lots/LotForm";
import LotTable from "@/components/lots/LotTable";
import ScanBarcode from "@/components/lots/ScanBarcode";

import type { Lot } from "@/types/Lot";
import { lotAPI } from "@/services/api";

function Lots() {
  const [createdLots, setCreatedLots] = useState<Lot[]>([]);
  const [completedLots, setCompletedLots] = useState<Lot[]>([]);
  const [lotView, setLotView] = useState<"created" | "completed">("created");
  const [completedDate, setCompletedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [mode, setMode] = useState<"create" | "scan">("create");

  const [editingLot, setEditingLot] = useState<Lot | null>(null);

  useEffect(() => {
    loadLots();
  }, [completedDate]);

  const loadLots = async () => {
    try {
      const created = await lotAPI.getCreated();
      const completed = await lotAPI.getCompleted(completedDate);
      setCreatedLots(created);
      setCompletedLots(completed);
    } catch (error) {
      console.error("Failed to load lots", error);
    }
  };

  const filteredCreatedLots = useMemo(() => {
    return createdLots.filter((lot) => {
      const value = search.toLowerCase();
      return (
        lot.lotNumber.toLowerCase().includes(value) ||
        lot.quality.toLowerCase().includes(value)
      );
    });
  }, [createdLots, search]);

  const filteredCompletedLots = useMemo(() => {
    return completedLots.filter((lot) => {
      const value = search.toLowerCase();
      return (
        lot.lotNumber.toLowerCase().includes(value) ||
        lot.quality.toLowerCase().includes(value)
      );
    });
  }, [completedLots, search]);

  const handleSave = (lot: Lot) => {
    if (editingLot) {
      setCreatedLots((prev) =>
        prev.map((item) =>
          item.id === lot.id
            ? {
                ...lot,
                updatedAt: new Date().toISOString(),
              }
            : item
        )
      );
    } else {
      setCreatedLots((prev) => [
        ...prev,
        {
          ...lot,
          id: Date.now(),
        },
      ]);
    }

    setOpen(false);
    setEditingLot(null);
  };

  const handleUpdateScan = async (_updatedLot: Lot) => {
    setOpen(false);

    await loadLots();
  };

  const handleEdit = (lot: Lot) => {
    setEditingLot(lot);
    if (lot.status === "Completed") {
      setMode("scan");
    } else {
      setMode("create");
    }
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lot?\n\nThis will also delete related production data."
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await lotAPI.delete(id);

      setCreatedLots((prev) =>
        prev.filter((item) => item._id !== id)
      );

      setCompletedLots((prev) =>
        prev.filter((item) => item._id !== id)
      );

      alert("Lot deleted successfully");
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete lot");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Lots</h1>
          <p className="text-muted-foreground">Manage production lots.</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => {
            setMode("create");
            setEditingLot(null);
            setOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Lot
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            setMode("scan");
            setEditingLot(null);
            setOpen(true);
          }}
        >
          Scan Barcode
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <Input
            placeholder="Search lot or quality"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      <select
        className="border rounded-md p-2"
        value={lotView}
        onChange={(e) =>
          setLotView(e.target.value as "created" | "completed")
        }
      >
        <option value="created">Created Lots</option>
        <option value="completed">Completed Lots</option>
      </select>

      {lotView === "created" && (
        <>
          <h2 className="text-2xl font-bold">Created Lots</h2>
          <LotTable
            lots={filteredCreatedLots}
            onEdit={handleEdit}
            onDelete={handleDelete}
            showDepth={true}
          />
        </>
      )}

      {lotView === "completed" && (
        <>
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Completed Lots</h2>
            <Input
              type="date"
              value={completedDate}
              onChange={(e) => setCompletedDate(e.target.value)}
            />
          </div>
          <LotTable
            lots={filteredCompletedLots}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>
              {mode === "create"
                ? editingLot
                  ? "Edit Lot"
                  : "Create Lot"
                : "Scan Barcode"}
            </DialogTitle>
          </DialogHeader>

          {mode === "create" ? (
            <LotForm editingLot={editingLot} onSave={handleSave} />
          ) : (
            <ScanBarcode
              lots={[...createdLots, ...completedLots]}
              editingLot={editingLot}
              onUpdate={handleUpdateScan}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Lots;