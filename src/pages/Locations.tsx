import React, { useState } from "react";
import { 
  MapPin, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Globe,
  Building2,
  Cloud
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import { useLocations, LocationCategory } from "@/src/lib/LocationContext";
import { toast } from "sonner";
import { cn } from "@/src/lib/utils";

export default function Locations() {
  const { locations, addLocation, updateLocation, deleteLocation } = useLocations();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<LocationCategory | null>(null);
  
  const [formData, setFormData] = useState({ name: "", description: "" });

  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    addLocation(formData);
    setFormData({ name: "", description: "" });
    setIsAddDialogOpen(false);
    toast.success("Location added successfully.");
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLocation || !formData.name) return;
    updateLocation(editingLocation.id, formData);
    setEditingLocation(null);
    setFormData({ name: "", description: "" });
    toast.success("Location updated successfully.");
  };

  const openEditDialog = (loc: LocationCategory) => {
    setEditingLocation(loc);
    setFormData({ name: loc.name, description: loc.description || "" });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Locations</h2>
          <p className="text-slate-500 mt-1">Manage and categorize physical and logical sites across your infrastructure.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger render={
            <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl gap-2 shadow-lg shadow-brand-blue/20">
              <Plus className="w-4 h-4" />
              Add Location
            </Button>
          } />
          <DialogContent className="sm:max-w-[425px] rounded-2xl border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Add New Location</DialogTitle>
              <DialogDescription>
                Create a new site category to use for devices, nodes, and IP assignments.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Location Name</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. London Data Center" 
                  className="rounded-xl bg-slate-50 border-none" 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input 
                  id="description" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="e.g. Primary DR site for EMEA" 
                  className="rounded-xl bg-slate-50 border-none" 
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl w-full">
                  Create Location
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search locations..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-none shadow-sm h-11 rounded-xl focus-visible:ring-brand-blue/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map((loc) => (
          <Card key={loc.id} className="border-none shadow-sm rounded-2xl bg-white group hover:shadow-md transition-all duration-300">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                loc.name.toLowerCase().includes("cloud") ? "bg-sky-50 text-sky-600" :
                loc.name.toLowerCase().includes("center") ? "bg-indigo-50 text-indigo-600" :
                "bg-slate-50 text-slate-600"
              )}>
                {loc.name.toLowerCase().includes("cloud") ? <Cloud className="w-6 h-6" /> :
                 loc.name.toLowerCase().includes("center") ? <Building2 className="w-6 h-6" /> :
                 <MapPin className="w-6 h-6" />}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-lg text-slate-400 hover:text-brand-blue hover:bg-brand-blue/5"
                  onClick={() => openEditDialog(loc)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                  onClick={() => {
                    deleteLocation(loc.id);
                    toast.success("Location deleted.");
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-bold text-lg text-slate-900">{loc.name}</h3>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{loc.description || "No description provided."}</p>
              
              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-medium text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3 h-3" />
                  Global Site
                </div>
                <span>ID: {loc.id}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingLocation} onOpenChange={(open) => !open && setEditingLocation(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit Location</DialogTitle>
            <DialogDescription>
              Update the details for this site category.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Location Name</Label>
              <Input 
                id="edit-name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="rounded-xl bg-slate-50 border-none" 
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input 
                id="edit-description" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="rounded-xl bg-slate-50 border-none" 
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl w-full">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
