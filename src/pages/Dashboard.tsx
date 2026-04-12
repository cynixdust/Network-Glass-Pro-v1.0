import React from "react";
import { 
  LayoutDashboard, 
  Server, 
  AlertTriangle, 
  Network, 
  FileText, 
  Settings, 
  Shield, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

const data = [
  { time: "00:00", cpu: 45, ram: 60 },
  { time: "04:00", cpu: 30, ram: 55 },
  { time: "08:00", cpu: 65, ram: 70 },
  { time: "12:00", cpu: 85, ram: 75 },
  { time: "16:00", cpu: 55, ram: 65 },
  { time: "20:00", cpu: 40, ram: 60 },
  { time: "23:59", cpu: 50, ram: 62 },
];

import { useDevices } from "@/src/lib/DeviceContext";
import { useAlerts } from "@/src/lib/AlertContext";

export default function Dashboard() {
  const { devices } = useDevices();
  const { alerts } = useAlerts();

  const recentAlerts = alerts.slice(0, 5);

  const stats = [
    { label: "Total Devices", value: devices.length.toString(), change: "+0", trend: "neutral", icon: Server, color: "blue" },
    { label: "Online", value: devices.filter(d => d.status === "UP").length.toString(), change: devices.length > 0 ? `${Math.round((devices.filter(d => d.status === "UP").length / devices.length) * 100)}%` : "0%", trend: "up", icon: CheckCircle2, color: "emerald" },
    { label: "Alerts", value: alerts.filter(a => a.status === "active").length.toString(), change: "0", trend: "neutral", icon: AlertCircle, color: "amber" },
    { label: "Critical", value: alerts.filter(a => a.status === "active" && a.severity === "critical").length.toString(), change: "0", trend: "neutral", icon: XCircle, color: "red" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Infrastructure Overview</h2>
          <p className="text-slate-500 mt-1">Real-time monitoring and health status across all sites.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">System Healthy</span>
          </div>
          <div className="h-8 w-px bg-slate-100 mx-1" />
          <div className="flex items-center gap-2 px-3 py-1.5 text-slate-500">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Uptime: 14d 6h</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm rounded-2xl overflow-hidden group hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                  "p-3 rounded-xl",
                  stat.color === "blue" && "bg-blue-50 text-blue-600",
                  stat.color === "emerald" && "bg-emerald-50 text-emerald-600",
                  stat.color === "amber" && "bg-amber-50 text-amber-600",
                  stat.color === "red" && "bg-red-50 text-red-600",
                )}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={cn(
                  "flex items-center text-xs font-bold px-2 py-1 rounded-full",
                  stat.trend === "up" ? "bg-emerald-50 text-emerald-600" : 
                  stat.trend === "down" ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-600"
                )}>
                  {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3 mr-1" /> : 
                   stat.trend === "down" ? <ArrowDownRight className="w-3 h-3 mr-1" /> : null}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Network Performance</CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-blue"></div>
                <span className="text-xs text-slate-500 font-medium">CPU Usage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-emerald"></div>
                <span className="text-xs text-slate-500 font-medium">RAM Usage</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="cpu" 
                  stroke="#2563EB" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCpu)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="ram" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRam)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {recentAlerts.map((alert, i) => (
              <div key={i} className="flex gap-4 group cursor-pointer">
                <div className={cn(
                  "w-1 h-12 rounded-full mt-1",
                  alert.severity === "critical" ? "bg-red-500" : "bg-amber-500"
                )}></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-blue transition-colors">{alert.device}</h4>
                    <span className="text-[10px] font-medium text-slate-400 uppercase">{alert.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{alert.msg}</p>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-slate-500 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 mt-4">
              View All Alerts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
