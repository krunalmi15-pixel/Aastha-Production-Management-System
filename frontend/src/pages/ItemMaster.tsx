import { useMemo, useState, useEffect } from "react";

import { lotAPI, itemAPI, productionAPI } from "@/services/api";

import type { Item } from "@/types/Item";
import { ITEM_CATEGORIES } from "@/types/ItemCategory";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
  Package,
} from "lucide-react";

function ItemMaster() {
  const [items, setItems] = useState<Item[]>([]);
  const [, setLots] = useState<any[]>([]);
  const [productions, setProductions] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [addingItem, setAddingItem] = useState(false);
  const [newItem, setNewItem] = useState<Item>({
    quality: "",
    number: "",
    percentage: 0,
    category: "DD",
    status: "Active",
  });

  const [fromDate, setFromDate] = useState("2026-08-01");
  const [tillDate, setTillDate] = useState("2026-08-31");

  // COLLAPSIBLE STATES
  const [productionOpen, setProductionOpen] = useState(false);
  const [itemListOpen, setItemListOpen] = useState(false);

  // Load Lots from Backend
  useEffect(() => {
    const loadLots = async () => {
      try {
        const data = await lotAPI.getAll();
        setLots(data);
      } catch (error) {
        console.error("Failed to load lots", error);
      }
    };

    loadLots();
  }, []);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await itemAPI.getAll();
        setItems(data);
      } catch (error) {
        console.error("Failed to load items", error);
      }
    };

    loadItems();
  }, []);

  useEffect(() => {
    const loadProductions = async () => {
      try {
        const data = await productionAPI.getAll();
        setProductions(data);
      } catch (error) {
        console.error(
          "Failed to load productions",
          error
        );
      }
    };

    loadProductions();
  }, []);

  const productionSummary = useMemo(() => {
    let DD = 0;
    let SH = 0;
    let AUTO = 0;
    let DIALIT = 0;
    let WASSCOVER = 0;

    const filteredProduction = productions.filter((p) => {
      return (
        p.scanDate >= fromDate &&
        p.scanDate <= tillDate &&
        p.status === "Completed"
      );
    });

    filteredProduction.forEach((p) => {
      const item = items.find(
        (i) => i._id === p.itemId
      );
      if (!item) return;

      const category = item.category;
      const qty = Number(p.quantity) || 0;

      if (category === "DD") {
        DD += qty;
      } else if (category === "SH") {
        SH += qty;
      } else if (category === "AUTO") {
        AUTO += qty;
      } else if (category === "DIALIT") {
        DIALIT += qty;
      } else if (category === "WASSCOVER") {
        WASSCOVER += qty;
      }
    });

    return {
      DD,
      SH,
      AUTO,
      DIALIT,
      WASSCOVER,
      TOTAL: DD + SH + AUTO + DIALIT + WASSCOVER,
    };
  }, [productions, items, fromDate, tillDate]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const searchMatch =
        (item.quality || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.number || "").toLowerCase().includes(search.toLowerCase());

      const categoryMatch = category === "All" || item.category === category;

      return searchMatch && categoryMatch;
    });
  }, [items, search, category]);

  const deleteItem = async (id: string) => {
    try {
      await itemAPI.delete(id);

      setItems((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );

      alert("Item deleted");
    } catch (error) {
      console.error(
        "Delete item failed",
        error
      );
    }
  };

  const handleEdit = (id: string) => {
    const item =
      items.find(
        (i) => i._id === id
      );

    if (item) {
      setEditingItem(item);
    }
  };

  const updateItem = async () => {
    if (!editingItem?._id) return;

    try {
      const updated =
        await itemAPI.update(
          editingItem._id,
          {
            quality: editingItem.quality,
            number: editingItem.number,
            percentage: editingItem.percentage,
            category: editingItem.category,
            status: editingItem.status,
          }
        );

      setItems((prev) =>
        prev.map((item) =>
          item._id === updated._id
          ? updated
          : item
        )
      );

      setEditingItem(null);

      alert("Item updated");
    } catch (error) {
      console.error(
        "Update item failed",
        error
      );
    }
  };

  const createItem = async () => {
    try {
      const created =
        await itemAPI.create(newItem);

      setItems((prev) => [
        ...prev,
        created,
      ]);

      setAddingItem(false);

      setNewItem({
        quality: "",
        number: "",
        percentage: 0,
        category: "DD",
        status: "Active",
      });

      alert("Item Added");
    } catch (error) {
      console.error(
        "Create item failed",
        error
      );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Item Master</h1>
          <p className="text-muted-foreground">Manage all production items.</p>
        </div>

        <Button
          onClick={() => setAddingItem(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* PRODUCTION SUMMARY */}
      <Card className="rounded-xl border">
        <div
          className="flex items-center justify-between p-5 cursor-pointer"
          onClick={() => setProductionOpen(!productionOpen)}
        >
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            <CardTitle>Production Summary</CardTitle>
          </div>

          {productionOpen ? <ChevronDown /> : <ChevronRight />}
        </div>

        {productionOpen && (
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium">From Date</label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Till Date</label>
                <Input
                  type="date"
                  value={tillDate}
                  onChange={(e) => setTillDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-6">
              <Card className="rounded-xl bg-purple-600 text-white border-0">
                <CardContent className="p-5">
                  <p className="text-sm">DD Production</p>
                  <h2 className="text-2xl font-bold">
                    {productionSummary.DD}
                  </h2>
                </CardContent>
              </Card>

              <Card className="rounded-xl bg-yellow-500 text-white border-0">
                <CardContent className="p-5">
                  <p className="text-sm">SH Production</p>
                  <h2 className="text-2xl font-bold">
                    {productionSummary.SH}
                  </h2>
                </CardContent>
              </Card>

              <Card className="rounded-xl bg-red-600 text-white border-0">
                <CardContent className="p-5">
                  <p className="text-sm">AUTO Production</p>
                  <h2 className="text-2xl font-bold">
                    {productionSummary.AUTO}
                  </h2>
                </CardContent>
              </Card>

              <Card className="rounded-xl bg-pink-600 text-white border-0">
                <CardContent className="p-5">
                  <p className="text-sm">DIALIT Production</p>
                  <h2 className="text-2xl font-bold">
                    {productionSummary.DIALIT}
                  </h2>
                </CardContent>
              </Card>

              <Card className="rounded-xl bg-teal-500 text-white border-0">
                <CardContent className="p-5">
                  <p className="text-sm">WASSCOVER</p>
                  <h2 className="text-2xl font-bold">
                    {productionSummary.WASSCOVER}
                  </h2>
                </CardContent>
              </Card>

              <Card className="rounded-xl bg-white border">
                <CardContent className="p-5">
                  <p className="text-sm text-black">
                    Total Production
                  </p>
                  <h2 className="text-2xl font-bold text-black">
                    {productionSummary.TOTAL}
                  </h2>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        )}
      </Card>

      {addingItem && (
        <Card className="p-5">
          <CardTitle className="mb-4">Add New Item</CardTitle>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Quality</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Enter item quality name (Example: DD, SH, AUTO)
              </p>
              <Input
                placeholder="Enter quality"
                value={newItem.quality}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    quality: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Number / Size</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Enter item size or number (Example: 3MM, 5MM, 10MM)
              </p>
              <Input
                placeholder="Enter size"
                value={newItem.number}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    number: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Percentage</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Enter percentage value if applicable
              </p>
              <Input
                type="number"
                placeholder="Enter percentage"
                value={newItem.percentage}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    percentage: Number(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label>Category</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Select item category
              </p>
              <select
                className="h-10 rounded-md border px-3 w-full"
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    category: e.target.value as any,
                  })
                }
              >
                {ITEM_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Status</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Select item availability status
              </p>
              <select
                className="h-10 rounded-md border px-3 w-full"
                value={newItem.status}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    status: e.target.value as any,
                  })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={createItem}>Save Item</Button>
            <Button
              variant="outline"
              onClick={() => {
                setAddingItem(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {editingItem && (
        <Card className="p-5">
          <CardTitle className="mb-4">Edit Item</CardTitle>
          <div className="grid grid-cols-2 gap-4">
            <Input
              value={editingItem.quality}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  quality: e.target.value,
                })
              }
            />
            <Input
              value={editingItem.number}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  number: e.target.value,
                })
              }
            />
            <Input
              type="number"
              value={editingItem.percentage}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  percentage: Number(e.target.value),
                })
              }
            />
          </div>
          <Button className="mt-4" onClick={updateItem}>
            Save Changes
          </Button>
        </Card>
      )}

      {/* ITEMS LIST */}
      <Card className="rounded-xl border">
        <div
          className="flex items-center justify-between p-5 cursor-pointer"
          onClick={() => setItemListOpen(!itemListOpen)}
        >
          <div className="flex items-center gap-2">
            <CardTitle>Items</CardTitle>
          </div>

          {itemListOpen ? <ChevronDown /> : <ChevronRight />}
        </div>

        {itemListOpen && (
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4" />
                <Input
                  placeholder="Search item..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="h-10 rounded-md border px-3"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="All">All</option>
                {ITEM_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="p-3 text-left">Code</th>
                    <th className="p-3 text-left">Quality</th>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-left">Number</th>
                    <th className="p-3 text-left">Variant</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td className="p-3">{item._id?.slice(-6)}</td>
                      <td className="p-3 font-medium">{item.quality}</td>
                      <td className="p-3">{item.category}</td>
                      <td className="p-3">{item.number}</td>
                      <td className="p-3">-</td>
                      <td className="p-3">
                        <Badge>{item.status}</Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleEdit(item._id!)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => deleteItem(item._id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

export default ItemMaster;