import React from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Activity, 
  Cpu, 
  HardDrive, 
  Zap, 
  Network, 
  Shield, 
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { cn } from "@/src/lib/utils";

const performanceData = [
  { time: "10:00", cpu: 42, ram: 58, network: 120 },
  { time: "10:15", cpu: 55, ram: 60, network: 150 },
  { time: "10:30", cpu: 48, ram: 59, network: 110 },
  { time: "10:45", cpu: 82, ram: 65, network: 280 },
  { time: "11:00", cpu: 60, ram: 62, network: 190 },
  { time: "11:15", cpu: 45, ram: 60, network: 130 },
  { time: "11:30", cpu: 50, ram: 61, network: 140 },
];

import { useDevices } from "@/src/lib/DeviceContext";

export default function DeviceDetail() {
  const { id } = useParams();
  const { devices } = useDevices();

  const foundDevice = devices.find(d => d.id === id);

  if (!foundDevice) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Device Not Found</h2>
        <p className="text-slate-500">The device you are looking for does not exist or has been removed.</p>
        <Link to="/devices">
          <Button className="bg-brand-blue text-white rounded-xl">Back to Inventory</Button>
        </Link>
      </div>
    );
  }

  // Mock extended data for the found device
  const device = {
    ...foundDevice,
    os: "Ubuntu 22.04 LTS",
    uptime: "14d 6h 22m",
    mac: "00:1A:2B:3C:4D:5E",
    cpu: "8 Core Intel Xeon",
    ram: "32GB DDR4",
    disk: "500GB SSD (82% used)",
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/devices">
          <Button variant="outline" size="icon" className="rounded-xl border-slate-200">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">{device.hostname}</h2>
            <Badge className={cn(
              "rounded-lg px-3 py-1 text-[10px] font-bold uppercase tracking-wider",
              device.status === "UP" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
              device.status === "WARNING" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-red-50 text-red-600 border-red-100"
            )}>
              {device.status}
            </Badge>
          </div>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <span className="font-mono text-sm">{device.ip}</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="text-sm">{device.location}</span>
          </p>
        </div>
        <div className="ml-auto flex gap-3">
          <Button variant="outline" className="rounded-xl gap-2 border-slate-200">
            <RefreshCw className="w-4 h-4" />
            Poll Now
          </Button>
          <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl gap-2 shadow-lg shadow-brand-blue/20">
            <ExternalLink className="w-4 h-4" />
            Remote Console
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "CPU Usage", value: "82%", icon: Cpu, color: "red" },
          { label: "RAM Usage", value: "65%", icon: Activity, color: "blue" },
          { label: "Disk Space", value: "18%", icon: HardDrive, color: "amber" },
          { label: "Uptime", value: device.uptime, icon: Clock, color: "emerald" },
        ].map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-xl",
                  stat.color === "red" && "bg-red-50 text-red-500",
                  stat.color === "blue" && "bg-blue-50 text-blue-500",
                  stat.color === "amber" && "bg-amber-50 text-amber-500",
                  stat.color === "emerald" && "bg-emerald-50 text-emerald-500",
                )}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">{stat.value}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white border border-slate-200 p-1 rounded-xl h-12">
          <TabsTrigger value="overview" className="rounded-lg px-6">Overview</TabsTrigger>
          <TabsTrigger value="metrics" className="rounded-lg px-6">Metrics</TabsTrigger>
          <TabsTrigger value="interfaces" className="rounded-lg px-6">Interfaces</TabsTrigger>
          <TabsTrigger value="alerts" className="rounded-lg px-6">Alerts</TabsTrigger>
          <TabsTrigger value="logs" className="rounded-lg px-6">Syslog</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 border-none shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Asset Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "OS", value: device.os },
                  { label: "MAC Address", value: device.mac },
                  { label: "CPU Model", value: device.cpu },
                  { label: "Memory", value: device.ram },
                  { label: "Storage", value: device.disk },
                  { label: "Last Seen", value: device.lastSeen },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between py-2 border-b border-slate-50 last:border-0">
                    <span className="text-sm text-slate-500">{item.label}</span>
                    <span className="text-sm font-bold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Performance History (1h)</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Area type="monotone" dataKey="cpu" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorPerf)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="interfaces">
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-sm font-bold text-slate-700">Interface</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-700">Status</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-700">Speed</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-700">Inbound</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-700">Outbound</th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-700 text-right">Errors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { name: "eth0", status: "UP", speed: "10 Gbps", in: "1.2 Gbps", out: "850 Mbps", err: "0" },
                    { name: "eth1", status: "UP", speed: "10 Gbps", in: "45 Mbps", out: "12 Mbps", err: "0" },
                    { name: "lo", status: "UP", speed: "N/A", in: "2 Mbps", out: "2 Mbps", err: "0" },
                    { name: "docker0", status: "DOWN", speed: "1 Gbps", in: "0", out: "0", err: "0" },
                  ].map((iface) => (
                    <tr key={iface.name} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">{iface.name}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={cn(
                          "rounded-lg text-[10px] font-bold uppercase tracking-wider",
                          iface.status === "UP" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"
                        )}>
                          {iface.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{iface.speed}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{iface.in}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{iface.out}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 text-right">{iface.err}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
