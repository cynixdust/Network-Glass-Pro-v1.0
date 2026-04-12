import React, { useState } from "react";
import { 
  Database, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Globe, 
  Hash, 
  CheckCircle2, 
  AlertCircle,
  MoreHorizontal,
  ChevronRight,
  ArrowLeft,
  Info,
  PieChart as PieChartIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/components/ui/tooltip";
import { cn } from "@/src/lib/utils";
import { toast } from "sonner";
import { AddSubnetDialog } from "@/src/components/AddSubnetDialog";
import { EditIPDialog } from "@/src/components/EditIPDialog";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from "recharts";

const subnets = [
  { id: "1", network: "10.0.0.0/24", name: "Core Infrastructure", used: 142, total: 254, site: "Data Center A", status: "HEALTHY" },
  { id: "2", network: "192.168.1.0/24", name: "Office LAN", used: 210, total: 254, site: "Site B", status: "WARNING" },
  { id: "3", network: "172.16.0.0/16", name: "DMZ & External", used: 45, total: 65534, site: "Data Center A", status: "HEALTHY" },
  { id: "4", network: "10.1.0.0/24", name: "Voice/VoIP", used: 250, total: 254, site: "Data Center A", status: "CRITICAL" },
];

// Generate dummy IP data for a /24 subnet (first 254 addresses)
const generateIPs = (network: string) => {
  const base = network.split('.').slice(0, 3).join('.');
  return Array.from({ length: 254 }, (_, i) => {
    const lastOctet = i + 1;
    const status = Math.random() > 0.7 ? "FREE" : 
                  Math.random() > 0.8 ? "OFFLINE" : 
                  Math.random() > 0.9 ? "RESERVED" : "USED";
    return {
      address: `${base}.${lastOctet}`,
      status,
      hostname: status === "USED" ? `device-${lastOctet}.netpulse.io` : null,
      owner: status === "USED" ? "IT Infrastructure" : null,
      description: status === "USED" ? "Production server node" : null,
      location: "Data Center A",
      notes: status === "USED" ? "Monitored via SNMP v3" : ""
    };
  });
};

export default function IPAM() {
  const [selectedSubnet, setSelectedSubnet] = useState<typeof subnets[0] | null>(null);
  const [ips, setIps] = useState<any[]>([]);
  const [editingIP, setEditingIP] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleSubnetClick = (subnet: typeof subnets[0]) => {
    setSelectedSubnet(subnet);
    setIps(generateIPs(subnet.network));
  };

  const handleIPClick = (ip: any) => {
    setEditingIP(ip);
    setIsEditDialogOpen(true);
  };

  const handleIPSave = (updatedIP: any) => {
    setIps(prev => prev.map(ip => ip.address === updatedIP.address ? updatedIP : ip));
  };

  const handleExport = () => {
    const dataToExport = selectedSubnet ? ips : subnets;
    const headers = selectedSubnet 
      ? ["Address", "Status", "Hostname", "Owner", "Description"]
      : ["Network", "Name", "Used", "Total", "Site", "Status"];
    
    const csvContent = [
      headers.join(","),
      ...dataToExport.map(item => {
        if (selectedSubnet) {
          return [item.address, item.status, item.hostname || "", item.owner || "", item.description || ""].join(",");
        } else {
          return [item.network, item.name, item.used, item.total, item.site, item.status].join(",");
        }
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `ipam_export_${selectedSubnet ? selectedSubnet.network.replace(/\//g, '_') : 'all'}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Export completed successfully");
  };

  const chartData = [
    { name: "Used", value: ips.filter(ip => ip.status === "USED").length, color: "#2563EB" },
    { name: "Free", value: ips.filter(ip => ip.status === "FREE").length, color: "#e2e8f0" },
    { name: "Offline", value: ips.filter(ip => ip.status === "OFFLINE").length, color: "#ef4444" },
    { name: "Reserved", value: ips.filter(ip => ip.status === "RESERVED").length, color: "#f59e0b" },
  ];

  if (selectedSubnet) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-xl hover:bg-slate-100"
              onClick={() => setSelectedSubnet(null)}
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">{selectedSubnet.network}</h2>
                <Badge variant="outline" className="rounded-lg bg-slate-50 text-slate-500 border-slate-200">
                  {selectedSubnet.site}
                </Badge>
              </div>
              <p className="text-slate-500 mt-1">{selectedSubnet.name}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="rounded-xl gap-2 border-slate-200"
            onClick={handleExport}
          >
            <Download className="w-4 h-4" />
            Export Subnet CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {chartData.map((stat) => (
                <Card key={stat.name} className="border-none shadow-sm rounded-2xl bg-white">
                  <CardContent className="p-4 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stat.color }}></div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.name}</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
              <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">IP Address Grid</CardTitle>
                  <CardDescription>Visual representation of address allocation.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-16 lg:grid-cols-20 xl:grid-cols-24 gap-1.5">
                  <TooltipProvider>
                    {ips.map((ip, i) => {
                      const lastOctet = ip.address.split('.').pop();
                      return (
                        <Tooltip key={i}>
                          <TooltipTrigger render={
                            <div 
                              onClick={() => handleIPClick(ip)}
                              className={cn(
                                "aspect-square rounded-sm cursor-pointer transition-all hover:scale-125 hover:z-10 shadow-sm flex items-center justify-center text-[7px] font-bold",
                                ip.status === "USED" ? "bg-brand-blue text-white" : 
                                ip.status === "FREE" ? "bg-slate-100 border border-slate-200 text-slate-400" : 
                                ip.status === "OFFLINE" ? "bg-red-500 text-white" : "bg-amber-500 text-white"
                              )}
                            >
                              {lastOctet}
                            </div>
                          } />
                          <TooltipContent className="rounded-xl p-3 border-none shadow-2xl bg-slate-900 text-white">
                          <div className="space-y-1">
                            <p className="font-bold text-sm">{ip.address}</p>
                            <p className="text-[10px] uppercase font-bold text-slate-400">{ip.status}</p>
                            {ip.hostname && <p className="text-xs text-blue-300">{ip.hostname}</p>}
                            {ip.owner && <p className="text-[10px] text-slate-400">Owner: {ip.owner}</p>}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm rounded-2xl bg-white h-full">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-brand-blue" />
                  Utilization Breakdown
                </CardTitle>
                <CardDescription>Subnet allocation distribution</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""}
                      labelLine={false}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => {
                        const total = chartData.reduce((acc, curr) => acc + curr.value, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return [`${value} (${percentage}%)`, "Count"];
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value, entry: any) => {
                        const total = chartData.reduce((acc, curr) => acc + curr.value, 0);
                        const percentage = ((entry.payload.value / total) * 100).toFixed(1);
                        return <span className="text-xs font-bold text-slate-600">{value} ({percentage}%)</span>
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        <EditIPDialog 
          ip={editingIP} 
          open={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen} 
          onSave={handleIPSave} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">IPAM</h2>
          <p className="text-slate-500 mt-1">IP Address Management and subnet utilization tracking.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="rounded-xl gap-2 border-slate-200"
            onClick={handleExport}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <AddSubnetDialog />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm rounded-2xl bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total IPs Managed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">66,296</div>
            <p className="text-xs text-slate-400 mt-1">Across 14 subnets</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm rounded-2xl bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">78%</div>
            <p className="text-xs text-slate-400 mt-1">2 subnets near capacity</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm rounded-2xl bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Reserved IPs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-blue">1,240</div>
            <p className="text-xs text-slate-400 mt-1">Static assignments</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-white border-b border-slate-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search subnets or VLANs..." 
                className="pl-10 bg-slate-50 border-none focus-visible:ring-brand-blue/20 h-10 rounded-xl"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-lg border-slate-200 text-slate-600 gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-50">
            {subnets.map((subnet) => {
              const percent = Math.round((subnet.used / subnet.total) * 100);
              return (
                <div 
                  key={subnet.id} 
                  className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  onClick={() => handleSubnetClick(subnet)}
                >
                  <div className="flex items-center gap-4 w-1/4">
                    <div className={cn(
                      "p-3 rounded-xl",
                      subnet.status === "HEALTHY" ? "bg-emerald-50 text-emerald-600" : 
                      subnet.status === "WARNING" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                    )}>
                      <Hash className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{subnet.network}</h4>
                      <p className="text-sm text-slate-500 truncate">{subnet.name}</p>
                    </div>
                  </div>

                  <div className="flex-1 max-w-xs mx-8">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-500">{subnet.used} / {subnet.total} IPs</span>
                        <span className={cn(
                          "font-bold",
                          percent > 90 ? "text-red-600" : percent > 70 ? "text-amber-600" : "text-emerald-600"
                        )}>{percent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all duration-500",
                            percent > 90 ? "bg-red-500" : percent > 70 ? "bg-amber-500" : "bg-emerald-500"
                          )} 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">{subnet.site}</p>
                      <Badge variant="outline" className={cn(
                        "rounded-lg text-[10px] uppercase font-bold tracking-wider mt-1",
                        subnet.status === "HEALTHY" ? "border-emerald-200 text-emerald-600 bg-emerald-50" : 
                        subnet.status === "WARNING" ? "border-amber-200 text-amber-600 bg-amber-50" : "border-red-200 text-red-600 bg-red-50"
                      )}>
                        {subnet.status}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-lg group-hover:bg-white border border-transparent group-hover:border-slate-200">
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

