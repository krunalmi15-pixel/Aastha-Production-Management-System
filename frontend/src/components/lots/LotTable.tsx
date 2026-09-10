import {
  Eye,
  Pencil,
  Trash2,
  Printer,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Lot } from "@/types/Lot";
import { lotAPI } from "@/services/api";

type Props = {
  lots: Lot[];
  onEdit: (lot: Lot) => void;
  onDelete: (id: string) => void;
  showDepth?: boolean;
};

function LotTable({
  lots,
  onEdit,
  onDelete,
  showDepth = false,
}: Props) {
  const [printLot, setPrintLot] = useState<Lot | null>(null);

  const printLabel = async () => {
    if (!printLot) {
      alert("Lot missing");
      return;
    }

    try {
      await lotAPI.print(
        String(printLot._id)
      );

      alert(
        "Print data prepared successfully"
      );
    } catch (error) {
      console.error(
        "Print failed",
        error
      );

      alert(
        "Print failed"
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left">Lot No.</th>
              <th className="p-4 text-left">Quality</th>
              <th className="p-4 text-left">Number</th>
              <th className="p-4 text-left">
                Percentage</th>

              {showDepth && (<th className="p-4 text-left">
                Depth</th>
              )}
              <th className="p-4 text-left">Qty</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {lots.map((lot) => (
              <tr key={lot._id} className="border-b">
                <td className="p-4">{lot.lotNumber}</td>
                <td className="p-4">{lot.quality}</td>
                <td className="p-4">{lot.number}</td>
                <td className="p-4">
                  {lot.percentage}</td>

                {showDepth && (<td className="p-4">

                  {
                    (() => { const depth = Number(lot.number) * Number(lot.percentage); return depth % 1 >= 0.5 ? Math.ceil(depth) : depth; })()

                  }</td>

                )}
                <td className="p-4">
                  {lot.quantity}</td>
                <td className="p-4">
                  <span className="rounded-full border px-3 py-1 text-sm">
                    {lot.status}
                  </span>
                </td>

                <td className="p-4 flex gap-2">
                  <Button size="icon" variant="outline">
                    <Eye size={16} />
                  </Button>

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => onEdit(lot)}
                  >
                    <Pencil size={16} />
                  </Button>

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setPrintLot(lot)}
                  >
                    <Printer size={16} />
                  </Button>

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      if (lot._id) {
                        onDelete(String(lot._id));
                      }
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {printLot && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 space-y-4">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">Print Label</h2>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setPrintLot(null)}
              >
                <X size={18} />
              </Button>
            </div>

            <div className="border p-4 space-y-2">
              <p><b>LOT NO:</b> {printLot.lotNumber}</p>
              <p><b>QUALITY:</b> {printLot.quality}</p>
              <p><b>NUMBER:</b> {printLot.number}</p>
              <p><b>PERCENTAGE:</b> {printLot.percentage}</p>
              <p><b>QUANTITY:</b> {printLot.quantity}</p>
              <p><b>STATUS:</b> {printLot.status}</p>
            </div>

            <Button className="w-full" onClick={printLabel}>
              Print
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LotTable;