import React, { useState, useEffect, Suspense } from "react";
import { 
  Box, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Server,
  Layout,
  Maximize2,
  Settings2,
  Info,
  ChevronRight,
  ArrowRight,
  PieChart as PieChartIcon
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from "recharts";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/src/lib/utils";
import { useLocations } from "@/src/lib/LocationContext";
import { useRack, Rack, Device } from "@/src/lib/RackContext";

// Lazy load Rack3D for better performance
const Rack3D = React.lazy(() => import("@/src/components/Rack3D").then(module => ({ default: module.Rack3D })));

export default function RackManagement() {
  const { locations } = useLocations();
  const { racks, addRack, addDeviceToRack, removeDeviceFromRack } = useRack();
  const [selectedRackId, setSelectedRackId] = useState<string>(racks[0]?.id || "");
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const [isAddRackOpen, setIsAddRackOpen] = useState(false);
  
  const selectedRack = racks.find(r => r.id === selectedRackId) || racks[0];

  useEffect(() => {
    if (!selectedRackId && racks.length > 0) {
      setSelectedRackId(racks[0].id);
    }
  }, [racks, selectedRackId]);

  // Calculate chart data for device types
  const typeDistribution = selectedRack.devices.reduce((acc: any, device) => {
    acc[device.type] = (acc[device.type] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(typeDistribution).map(type => ({
    name: type,
    value: typeDistribution[type],
    color: type === "SERVER" ? "#10b981" : 
           type === "SWITCH" ? "#3b82f6" : 
           type === "ROUTER" ? "#f59e0b" : "#ef4444"
  }));

  // Add "Empty Space" to the chart for utilization focus
  const usedU = selectedRack.devices.reduce((acc, d) => acc + d.uSize, 0);
  const freeU = selectedRack.totalU - usedU;
  
  const utilizationData = [
    { name: "Used U", value: usedU, color: "#3b82f6" },
    { name: "Free U", value: freeU, color: "#f1f5f9" }
  ];

  const [newDevice, setNewDevice] = useState<Omit<Device, "id">>({
    name: "",
    uPos: 1,
    uSize: 1,
    type: "SERVER"
  });

  const [newRack, setNewRack] = useState<Omit<Rack, "id" | "devices">>({
    name: "",
    location: locations[0]?.name || "Data Center A",
    totalU: 42
  });

  const handleAddRack = (e: React.FormEvent) => {
    e.preventDefault();
    addRack(newRack);
    setIsAddRackOpen(false);
    setNewRack({ name: "", location: locations[0]?.name || "Data Center A", totalU: 42 });
    toast.success(`Rack ${newRack.name} created successfully.`);
  };

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for collisions (simplified)
    const collision = selectedRack.devices.find(d => {
      const dEnd = d.uPos + d.uSize - 1;
      const newEnd = newDevice.uPos + newDevice.uSize - 1;
      return (newDevice.uPos >= d.uPos && newDevice.uPos <= dEnd) || 
             (newEnd >= d.uPos && newEnd <= dEnd);
    });

    if (collision) {
      toast.error(`Collision detected with ${collision.name} at U${collision.uPos}`);
      return;
    }

    if (newDevice.uPos + newDevice.uSize - 1 > selectedRack.totalU) {
      toast.error("Device exceeds rack height");
      return;
    }

    addDeviceToRack(selectedRackId, newDevice);

    setIsAddDeviceOpen(false);
    setNewDevice({ name: "", uPos: 1, uSize: 1, type: "SERVER" });
    toast.success("Equipment added to rack.");
  };

  const removeDevice = (deviceId: string) => {
    removeDeviceFromRack(selectedRackId, deviceId);
    toast.success("Equipment removed.");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Rack Management</h2>
          <p className="text-slate-500 mt-1">Visualize and manage physical equipment placement in server racks.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl gap-2 border-slate-200">
            <Layout className="w-4 h-4" />
            Floor Plan
          </Button>
          <Dialog open={isAddDeviceOpen} onOpenChange={setIsAddDeviceOpen}>
            <DialogTrigger render={
              <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl gap-2 shadow-lg shadow-brand-blue/20">
                <Plus className="w-4 h-4" />
                Add Equipment
              </Button>
            } />
            <DialogContent className="sm:max-w-[425px] rounded-2xl border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Add Equipment to {selectedRack.name}</DialogTitle>
                <DialogDescription>
                  Specify the U position and size for the new hardware.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddDevice} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Device Name</Label>
                  <Input 
                    id="name" 
                    value={newDevice.name}
                    onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
                    placeholder="e.g. Storage-Node-05" 
                    className="rounded-xl bg-slate-50 border-none" 
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select 
                      value={newDevice.type} 
                      onValueChange={(v: any) => setNewDevice({...newDevice, type: v})}
                    >
                      <SelectTrigger className="rounded-xl bg-slate-50 border-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SERVER">Server</SelectItem>
                        <SelectItem value="SWITCH">Switch</SelectItem>
                        <SelectItem value="ROUTER">Router</SelectItem>
                        <SelectItem value="FIREWALL">Firewall</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="uSize">Size (U)</Label>
                    <Input 
                      id="uSize" 
                      type="number" 
                      min={1} 
                      max={10}
                      value={newDevice.uSize}
                      onChange={(e) => setNewDevice({...newDevice, uSize: parseInt(e.target.value)})}
                      className="rounded-xl bg-slate-50 border-none" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uPos">Starting U Position (1-{selectedRack.totalU})</Label>
                  <Input 
                    id="uPos" 
                    type="number" 
                    min={1} 
                    max={selectedRack.totalU}
                    value={newDevice.uPos}
                    onChange={(e) => setNewDevice({...newDevice, uPos: parseInt(e.target.value)})}
                    className="rounded-xl bg-slate-50 border-none" 
                  />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl w-full">
                    Add to Rack
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rack Selector & List */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold">Racks</CardTitle>
              <CardDescription>Select a rack to visualize</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {racks.map((rack) => (
                <button
                  key={rack.id}
                  onClick={() => setSelectedRackId(rack.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left group",
                    selectedRackId === rack.id 
                      ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20" 
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    selectedRackId === rack.id ? "bg-white/20" : "bg-white shadow-sm"
                  )}>
                    <Box className={cn("w-5 h-5", selectedRackId === rack.id ? "text-white" : "text-brand-blue")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{rack.name}</p>
                    <p className={cn(
                      "text-[10px] uppercase font-bold tracking-wider",
                      selectedRackId === rack.id ? "text-white/60" : "text-slate-400"
                    )}>
                      {rack.location}
                    </p>
                  </div>
                  <ChevronRight className={cn(
                    "w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity",
                    selectedRackId === rack.id ? "text-white" : "text-slate-400"
                  )} />
                </button>
              ))}
              
              <Dialog open={isAddRackOpen} onOpenChange={setIsAddRackOpen}>
                <DialogTrigger render={
                  <Button variant="ghost" className="w-full rounded-xl border-dashed border-2 border-slate-200 text-slate-400 hover:text-brand-blue hover:border-brand-blue/50 hover:bg-brand-blue/5 mt-4 py-8 flex-col gap-2">
                    <Plus className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">New Rack</span>
                  </Button>
                } />
                <DialogContent className="sm:max-w-[425px] rounded-2xl border-none shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Create New Rack</DialogTitle>
                    <DialogDescription>
                      Define a new physical rack for equipment placement.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddRack} className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="rackName">Rack Name</Label>
                      <Input 
                        id="rackName" 
                        value={newRack.name}
                        onChange={(e) => setNewRack({...newRack, name: e.target.value})}
                        placeholder="e.g. RACK-03-BACKUP" 
                        className="rounded-xl bg-slate-50 border-none" 
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rackLocation">Location</Label>
                      <Select 
                        value={newRack.location} 
                        onValueChange={(v) => setNewRack({...newRack, location: v})}
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
                    <div className="space-y-2">
                      <Label htmlFor="totalU">Total Rack Height (U)</Label>
                      <Input 
                        id="totalU" 
                        type="number" 
                        min={1} 
                        max={52}
                        value={newRack.totalU}
                        onChange={(e) => setNewRack({...newRack, totalU: parseInt(e.target.value)})}
                        className="rounded-xl bg-slate-50 border-none" 
                      />
                    </div>
                    <DialogFooter className="pt-4">
                      <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl w-full">
                        Create Rack
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-brand-blue" />
                Rack Capacity
              </CardTitle>
              <CardDescription>Utilization & Device Distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={utilizationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {utilizationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Device Types</p>
                <div className="grid grid-cols-2 gap-2">
                  {chartData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-bold text-slate-600 uppercase">{item.name}</span>
                      <span className="ml-auto text-xs font-bold text-slate-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold">Equipment List</CardTitle>
              <CardDescription>{selectedRack.devices.length} devices in {selectedRack.name}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[400px] overflow-y-auto px-6 pb-6 space-y-3">
                {selectedRack.devices.sort((a, b) => b.uPos - a.uPos).map((device) => (
                  <div key={device.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 group">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[10px] font-bold text-slate-400">
                      U{device.uPos}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{device.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">{device.type}</span>
                        <span className="text-[10px] text-slate-300">•</span>
                        <span className="text-[10px] text-slate-400 font-bold">{device.uSize}U</span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                      onClick={() => removeDevice(device.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {selectedRack.devices.length === 0 && (
                  <div className="text-center py-8">
                    <Server className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm text-slate-400 font-medium">No equipment in this rack</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3D Visualization */}
        <div className="lg:col-span-2 space-y-6">
          <Suspense fallback={
            <div className="w-full h-[600px] bg-slate-950 rounded-3xl flex items-center justify-center border border-white/5">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 font-medium">Initializing 3D Engine...</p>
              </div>
            </div>
          }>
            {selectedRack && <Rack3D totalU={selectedRack.totalU} devices={selectedRack.devices} />}
          </Suspense>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-none shadow-sm rounded-2xl bg-white p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Maximize2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Utilization</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {Math.round((selectedRack.devices.reduce((acc, d) => acc + d.uSize, 0) / selectedRack.totalU) * 100)}%
                  </p>
                </div>
              </div>
            </Card>
            <Card className="border-none shadow-sm rounded-2xl bg-white p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Settings2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available U</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {selectedRack.totalU - selectedRack.devices.reduce((acc, d) => acc + d.uSize, 0)}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="border-none shadow-sm rounded-2xl bg-white p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Power Load</p>
                  <p className="text-2xl font-bold text-slate-900">2.4 kW</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
