import React from "react";
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  ArrowUpRight,
  Filter,
  Share2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const deviceTypeData = [
  { name: "Servers", value: 45, color: "#2563EB" },
  { name: "Switches", value: 32, color: "#10B981" },
  { name: "Routers", value: 12, color: "#F59E0B" },
  { name: "Firewalls", value: 8, color: "#EF4444" },
  { name: "IoT/Other", value: 59, color: "#8B5CF6" },
];

const uptimeData = [
  { name: "Mon", uptime: 99.9 },
  { name: "Tue", uptime: 99.8 },
  { name: "Wed", uptime: 100 },
  { name: "Thu", uptime: 99.95 },
  { name: "Fri", uptime: 99.7 },
  { name: "Sat", uptime: 100 },
  { name: "Sun", uptime: 100 },
];

export default function Reports() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">System Reports</h2>
          <p className="text-slate-500 mt-1">Generate and export comprehensive infrastructure performance audits.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl gap-2 border-slate-200">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </Button>
          <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl gap-2 shadow-lg shadow-brand-blue/20">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 border-none shadow-sm rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Device Distribution</CardTitle>
            <CardDescription>Breakdown by asset category.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {deviceTypeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-slate-500 font-medium">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Network Uptime Trend</CardTitle>
            <CardDescription>Average availability across all monitored sites.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={uptimeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis domain={[99, 100]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="uptime" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-100 p-6 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">Available Reports</CardTitle>
            <CardDescription>Pre-configured reporting templates.</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="rounded-lg gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-50">
            {[
              { title: "Inventory Summary", desc: "Full list of all assets with IP and location mapping.", type: "Inventory", last: "Yesterday" },
              { title: "SLA Compliance", desc: "Uptime and response time metrics for critical services.", type: "Performance", last: "2 days ago" },
              { title: "Security Audit", desc: "Failed login attempts and unauthorized access events.", type: "Security", last: "1 week ago" },
              { title: "Capacity Planning", desc: "Storage and memory growth trends for the last 90 days.", type: "Planning", last: "3 days ago" },
            ].map((report, i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-brand-blue group-hover:text-white transition-colors">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{report.title}</h4>
                    <p className="text-sm text-slate-500">{report.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 rounded-lg">{report.type}</Badge>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">Generated: {report.last}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="rounded-lg">
                      <Share2 className="w-4 h-4 text-slate-400" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-lg border-slate-200">
                      <Download className="w-4 h-4 text-slate-600" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
