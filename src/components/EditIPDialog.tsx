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
import { Globe, User, MapPin, FileText, Info } from "lucide-react";
import { toast } from "sonner";
import { useLocations } from "@/src/lib/LocationContext";

interface IPData {
  address: string;
  status: string;
  hostname: string | null;
  owner?: string;
  description?: string;
  location?: string;
  notes?: string;
}

interface EditIPDialogProps {
  ip: IPData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedIP: IPData) => void;
}

export function EditIPDialog({ ip, open, onOpenChange, onSave }: EditIPDialogProps) {
  const { locations } = useLocations();
  const [formData, setFormData] = useState<IPData>({
    address: "",
    status: "FREE",
    hostname: "",
    owner: "",
    description: "",
    location: locations[0]?.name || "Data Center A",
    notes: ""
  });

  useEffect(() => {
    if (ip) {
      setFormData({
        address: ip.address,
        status: ip.status,
        hostname: ip.hostname || "",
        owner: ip.owner || "",
        description: ip.description || "",
        location: ip.location || locations[0]?.name || "Data Center A",
        notes: ip.notes || ""
      });
    }
  }, [ip, locations]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast.success(`IP ${formData.address} updated successfully.`);
    onOpenChange(false);
  };

  if (!ip) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] rounded-2xl border-none shadow-2xl">
        <DialogHeader>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Globe className="w-6 h-6" />
          </div>
          <DialogTitle className="text-xl font-bold">Edit IP Details: {ip.address}</DialogTitle>
          <DialogDescription>
            Update enterprise identification and management details for this address.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Allocation Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(v) => setFormData({...formData, status: v})}
              >
                <SelectTrigger className="rounded-xl bg-slate-50 border-none">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USED">Used</SelectItem>
                  <SelectItem value="FREE">Free</SelectItem>
                  <SelectItem value="OFFLINE">Offline</SelectItem>
                  <SelectItem value="RESERVED">Reserved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hostname">Hostname</Label>
              <Input 
                id="hostname" 
                value={formData.hostname || ""} 
                onChange={(e) => setFormData({...formData, hostname: e.target.value})}
                placeholder="e.g. srv-prod-01" 
                className="rounded-xl bg-slate-50 border-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="owner">IP Owner / Department</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="owner" 
                  value={formData.owner} 
                  onChange={(e) => setFormData({...formData, owner: e.target.value})}
                  placeholder="e.g. IT Infrastructure" 
                  className="pl-10 rounded-xl bg-slate-50 border-none" 
                />
              </div>
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

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input 
              id="description" 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Briefly describe the purpose of this IP" 
              className="rounded-xl bg-slate-50 border-none" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea 
              id="notes" 
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full rounded-xl bg-slate-50 border-none p-3 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none resize-none"
              placeholder="Add any additional technical notes or history..."
            />
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
