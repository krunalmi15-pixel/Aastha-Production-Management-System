import { useEffect, useState } from "react";

import type { Settings as SettingsType } from "@/types/Settings";

import { settingsAPI } from "@/services/api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Settings as SettingsIcon,
  Save,
  Building2,
  Printer,
  FileText,
} from "lucide-react";

function Settings() {
  const [settings, setSettings] = useState<SettingsType>({
    companyName: "Aastha Engineering",
    printerName: "",
    barTenderPath: "",
    templatePath: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsAPI.get();
      setSettings(data);
    } catch (error) {
      console.error("Failed to load settings", error);
    } finally {
      setLoading(false);
    }
  };

  const update = (field: keyof SettingsType, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await settingsAPI.update(settings);
      alert("Settings saved successfully");
    } catch (error) {
      console.error("Failed to save settings", error);
      alert("Settings save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading settings...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Configure your Production Management System.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            System Configuration
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <Label className="mb-2 block">Company Name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                value={settings.companyName || ""}
                onChange={(e) => update("companyName", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Default Printer</Label>
            <div className="relative">
              <Printer className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Enter printer name"
                value={settings.printerName || ""}
                onChange={(e) => update("printerName", e.target.value)}
              />
            </div>
          </div>

          <div>

            <Label className="mb-2 block">
              BarTender Application Path
            </Label>

            <Input
              placeholder="C:\Program Files (x86)\Seagull\BarTender UltraLite\BarTend.exe"
              value={settings.barTenderPath || ""}
              onChange={(e)=>
                update(
                  "barTenderPath",
                  e.target.value
                )
              }
            />

          </div>

          <div>

            <Label className="mb-2 block">
              Template Path
            </Label>

            <Input
              placeholder="C:\Aastha\Templates\LotLabel.btw"
              value={settings.templatePath || ""}
              onChange={(e)=>
                update(
                  "templatePath",
                  e.target.value
                )
              }
            />

          </div>

          <Button className="w-full" onClick={saveSettings} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default Settings;