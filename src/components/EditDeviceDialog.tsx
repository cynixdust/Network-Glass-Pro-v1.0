import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Server, MapPin, Tag, Info } from "lucide-react";
import { toast } from "sonner";
import { useLocations } from "@/src/lib/LocationContext";

interface DeviceData {
  id: string;
  hostname: string;
  ip: string;
  type: string;
  status: string;
  location: string;
}

interface EditDeviceDialogProps {
  device: DeviceData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedDevice: DeviceData) => void;
}

export function EditDeviceDialog({ device, open, onOpenChange, onSave }: EditDeviceDialogProps) {
  const { locations } = useLocations();
  const [formData, setFormData] = useState<DeviceData>({
    id: "",
    hostname: "",
    ip: "",
    type: "SWITCH",
    status: "UP",
    location: ""
  });

  useEffect(() => {
    if (device) {
      setFormData(device);
    }
  }, [device]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast.success(`Device ${formData.hostname} updated successfully.`);
    onOpenChange(false);
  };

  if (!device) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl border-none shadow-2xl">
        <DialogHeader>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Server className="w-6 h-6" />
          </div>
          <DialogTitle className="text-xl font-bold">Edit Device: {device.hostname}</DialogTitle>
          <DialogDescription>
            Update the asset details and location categorization.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hostname">Hostname</Label>
              <Input 
                id="hostname" 
                value={formData.hostname}
                onChange={(e) => setFormData({...formData, hostname: e.target.value})}
                required 
                className="rounded-xl bg-slate-50 border-none" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ip">IP Address</Label>
              <Input 
                id="ip" 
                value={formData.ip}
                onChange={(e) => setFormData({...formData, ip: e.target.value})}
                required 
                className="rounded-xl bg-slate-50 border-none" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Device Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(v) => setFormData({...formData, type: v})}
              >
                <SelectTrigger className="rounded-xl bg-slate-50 border-none">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SWITCH">Switch</SelectItem>
                  <SelectItem value="ROUTER">Router</SelectItem>
                  <SelectItem value="SERVER">Server</SelectItem>
                  <SelectItem value="FIREWALL">Firewall</SelectItem>
                  <SelectItem value="IOT">IoT / Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select 
                value={formData.location} 
                onValueChange={(v) => setFormData({...formData, location: v})}
              >
                <SelectTrigger className="rounded-xl bg-slate-50 border-none">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.name}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl border-slate-200">
              Cancel
            </Button>
            <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl min-w-[120px]">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
