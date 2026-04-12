import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Plus, Server, Globe, Shield } from "lucide-react";
import { toast } from "sonner";
import { useLocations } from "@/src/lib/LocationContext";
import { useDevices } from "@/src/lib/DeviceContext";

interface AddDeviceDialogProps {
  children?: React.ReactElement;
}

export function AddDeviceDialog({ children }: AddDeviceDialogProps) {
  const { locations } = useLocations();
  const { addDevice } = useDevices();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    hostname: "",
    ip: "",
    mac: "",
    type: "SWITCH",
    os: "",
    location: locations[0]?.name || "Default",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      addDevice({
        hostname: formData.hostname,
        ip: formData.ip,
        mac: formData.mac,
        type: formData.type,
        os: formData.os,
        location: formData.location,
        status: "UP",
      });
      setLoading(false);
      setOpen(false);
      toast.success("Device added successfully.");
      setFormData({
        hostname: "",
        ip: "",
        mac: "",
        type: "SWITCH",
        os: "",
        location: locations[0]?.name || "Default",
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children || (
          <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl gap-2 shadow-lg shadow-brand-blue/20">
            <Plus className="w-4 h-4" />
            <span>Add Device</span>
          </Button>
        )} />
      <DialogContent className="sm:max-w-[500px] rounded-2xl border-none shadow-2xl">
        <DialogHeader>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Server className="w-6 h-6" />
          </div>
          <DialogTitle className="text-xl font-bold">Add New Device</DialogTitle>
          <DialogDescription>
            Enter the details of the asset you want to monitor. We'll perform an initial ping and SNMP walk.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hostname">Hostname</Label>
              <Input 
                id="hostname" 
                placeholder="e.g. core-sw-01" 
                required 
                className="rounded-xl bg-slate-50 border-none"
                value={formData.hostname}
                onChange={(e) => setFormData(prev => ({ ...prev, hostname: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ip">IP Address</Label>
              <Input 
                id="ip" 
                placeholder="e.g. 10.0.0.1" 
                required 
                className="rounded-xl bg-slate-50 border-none"
                value={formData.ip}
                onChange={(e) => setFormData(prev => ({ ...prev, ip: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mac">MAC Address (Optional)</Label>
              <Input 
                id="mac" 
                placeholder="e.g. 00:1A:2B:3C:4D:5E" 
                className="rounded-xl bg-slate-50 border-none"
                value={formData.mac}
                onChange={(e) => setFormData(prev => ({ ...prev, mac: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="os">Operating System</Label>
              <Input 
                id="os" 
                placeholder="e.g. Windows Server 2022" 
                className="rounded-xl bg-slate-50 border-none"
                value={formData.os}
                onChange={(e) => setFormData(prev => ({ ...prev, os: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Device Type</Label>
              <Select 
                value={formData.type}
                onValueChange={(val) => setFormData(prev => ({ ...prev, type: val }))}
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
                onValueChange={(val) => setFormData(prev => ({ ...prev, location: val }))}
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

          <div className="space-y-2">
            <Label htmlFor="credential">SNMP Credential</Label>
            <Select defaultValue="public-v2">
              <SelectTrigger className="rounded-xl bg-slate-50 border-none">
                <SelectValue placeholder="Select credential" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public-v2">Public (v2c)</SelectItem>
                <SelectItem value="private-v2">Private (v2c)</SelectItem>
                <SelectItem value="secure-v3">Secure Admin (v3)</SelectItem>
                <SelectItem value="none">None (Ping Only)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl border-slate-200">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl min-w-[120px]">
              {loading ? "Adding..." : "Add Device"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
