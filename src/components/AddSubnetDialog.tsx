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
import { Plus, Hash, Globe, Database } from "lucide-react";
import { toast } from "sonner";
import { useLocations } from "@/src/lib/LocationContext";
import { useIPAM } from "@/src/lib/IPAMContext";

interface AddSubnetDialogProps {
  children?: React.ReactElement;
}

export function AddSubnetDialog({ children }: AddSubnetDialogProps) {
  const { locations } = useLocations();
  const { addSubnet } = useIPAM();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    network: "",
    name: "",
    site: locations[0]?.name || "Default",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      addSubnet({
        network: formData.network,
        name: formData.name,
        site: formData.site,
        total: 254, // Default for /24
      });
      setLoading(false);
      setOpen(false);
      toast.success("Subnet added successfully to IPAM.");
      setFormData({
        network: "",
        name: "",
        site: locations[0]?.name || "Default",
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children || (
          <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl gap-2 shadow-lg shadow-brand-blue/20">
            <Plus className="w-4 h-4" />
            <span>Add Subnet</span>
          </Button>
        )} />
      <DialogContent className="sm:max-w-[500px] rounded-2xl border-none shadow-2xl">
        <DialogHeader>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Hash className="w-6 h-6" />
          </div>
          <DialogTitle className="text-xl font-bold">Add New Subnet</DialogTitle>
          <DialogDescription>
            Define a new network range for IP address management and tracking.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="network">Network Address (CIDR)</Label>
            <Input 
              id="network" 
              placeholder="e.g. 10.0.0.0/24" 
              required 
              className="rounded-xl bg-slate-50 border-none"
              value={formData.network}
              onChange={(e) => setFormData(prev => ({ ...prev, network: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Subnet Name / Description</Label>
            <Input 
              id="name" 
              placeholder="e.g. Core Infrastructure" 
              required 
              className="rounded-xl bg-slate-50 border-none"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="site">Site / Location</Label>
              <Select 
                value={formData.site}
                onValueChange={(val) => setFormData(prev => ({ ...prev, site: val }))}
              >
                <SelectTrigger className="rounded-xl bg-slate-50 border-none">
                  <SelectValue placeholder="Select site" />
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
            <div className="space-y-2">
              <Label htmlFor="vlan">VLAN ID (Optional)</Label>
              <Input id="vlan" type="number" placeholder="e.g. 100" className="rounded-xl bg-slate-50 border-none" />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl border-slate-200">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl min-w-[120px]">
              {loading ? "Adding..." : "Add Subnet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
