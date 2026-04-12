import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/src/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/src/components/ui/dropdown-menu";
import { cn } from "@/src/lib/utils";
import { AddDeviceDialog } from "@/src/components/AddDeviceDialog";
import { EditDeviceDialog } from "@/src/components/EditDeviceDialog";
import { toast } from "sonner";

const devices = [
  { id: "1", hostname: "core-switch-01", ip: "10.0.0.1", type: "SWITCH", status: "UP", location: "Data Center A", lastSeen: "2m ago" },
  { id: "2", hostname: "edge-router-01", ip: "10.0.0.254", type: "ROUTER", status: "UP", location: "Data Center A", lastSeen: "5m ago" },
  { id: "3", hostname: "web-srv-01", ip: "192.168.1.10", type: "SERVER", status: "WARNING", location: "Site B", lastSeen: "1m ago" },
  { id: "4", hostname: "db-srv-01", ip: "192.168.1.20", type: "SERVER", status: "UP", location: "Site B", lastSeen: "10m ago" },
  { id: "5", hostname: "backup-nas", ip: "192.168.1.50", type: "SERVER", status: "DOWN", location: "Site B", lastSeen: "2h ago" },
  { id: "6", hostname: "firewall-hq", ip: "10.0.0.5", type: "FIREWALL", status: "UP", location: "Data Center A", lastSeen: "30s ago" },
  { id: "7", hostname: "wifi-ap-01", ip: "192.168.2.1", type: "IOT", status: "UP", location: "Office 1", lastSeen: "4m ago" },
  { id: "8", hostname: "wifi-ap-02", ip: "192.168.2.2", type: "IOT", status: "WARNING", location: "Office 2", lastSeen: "8m ago" },
];

export default function Devices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deviceList, setDeviceList] = useState(devices);
  const [editingDevice, setEditingDevice] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredDevices = deviceList.filter(d => 
    d.hostname.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.ip.includes(searchTerm)
  );

  const handleEditDevice = (device: any) => {
    setEditingDevice(device);
    setIsEditDialogOpen(true);
  };

  const handleSaveDevice = (updatedDevice: any) => {
    setDeviceList(prev => prev.map(d => d.id === updatedDevice.id ? updatedDevice : d));
  };

  const handleDeleteDevice = (id: string) => {
    setDeviceList(prev => prev.filter(d => d.id !== id));
    toast.success("Device removed from inventory.");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Device Inventory</h2>
          <p className="text-slate-500 mt-1">Manage and monitor all assets across your infrastructure.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl gap-2 border-slate-200">
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button variant="outline" className="rounded-xl gap-2 border-slate-200">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <AddDeviceDialog />
        </div>
      </div>

      <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search by hostname or IP..." 
                className="pl-10 bg-slate-50 border-none focus-visible:ring-brand-blue/20 h-10 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-lg border-slate-200 text-slate-600 gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 rounded-lg px-3 py-1">
                {filteredDevices.length} Devices
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="font-bold text-slate-700 pl-6">Hostname</TableHead>
                <TableHead className="font-bold text-slate-700">IP Address</TableHead>
                <TableHead className="font-bold text-slate-700">Type</TableHead>
                <TableHead className="font-bold text-slate-700">Status</TableHead>
                <TableHead className="font-bold text-slate-700">Location</TableHead>
                <TableHead className="font-bold text-slate-700">Last Seen</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevices.map((device) => (
                <TableRow key={device.id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-bold text-slate-900 pl-6">
                    <Link to={`/devices/${device.id}`} className="hover:text-brand-blue transition-colors">
                      {device.hostname}
                    </Link>
                  </TableCell>
                  <TableCell className="text-slate-600 font-mono text-xs">{device.ip}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-lg border-slate-200 text-slate-500 font-medium text-[10px] tracking-wider uppercase">
                      {device.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        device.status === "UP" ? "bg-emerald-500" : 
                        device.status === "WARNING" ? "bg-amber-500" : "bg-red-500"
                      )}></div>
                      <span className={cn(
                        "text-xs font-bold",
                        device.status === "UP" ? "text-emerald-600" : 
                        device.status === "WARNING" ? "text-amber-600" : "text-red-600"
                      )}>
                        {device.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">{device.location}</TableCell>
                  <TableCell className="text-slate-400 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {device.lastSeen}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-lg hover:bg-white shadow-sm border border-transparent hover:border-slate-200" />}>
                        <MoreHorizontal className="w-4 h-4 text-slate-400" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl border-slate-200 w-40">
                        <DropdownMenuItem className="p-0">
                          <Link to={`/devices/${device.id}`} className="flex items-center gap-2 focus:bg-slate-50 cursor-pointer w-full px-2 py-1.5 text-sm">
                            <Eye className="w-4 h-4 text-slate-400" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="gap-2 focus:bg-slate-50 cursor-pointer"
                          onClick={() => handleEditDevice(device)}
                        >
                          <Edit className="w-4 h-4 text-slate-400" />
                          Edit Device
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="gap-2 focus:bg-red-50 text-red-600 cursor-pointer"
                          onClick={() => handleDeleteDevice(device.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EditDeviceDialog 
        device={editingDevice} 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
        onSave={handleSaveDevice} 
      />
    </div>
  );
}
