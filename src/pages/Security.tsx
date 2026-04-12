import React from "react";
import { 
  Shield, 
  Lock, 
  UserCheck, 
  AlertOctagon, 
  Eye, 
  History, 
  Key, 
  ShieldCheck,
  Search,
  Filter,
  Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";

const auditLogs = [
  { id: "1", user: "admin@netpulse.io", action: "Deleted Device", target: "core-switch-05", time: "2m ago", status: "SUCCESS", ip: "10.0.0.52" },
  { id: "2", user: "j.doe@netpulse.io", action: "Login Attempt", target: "System", time: "15m ago", status: "FAILED", ip: "192.168.1.105" },
  { id: "3", user: "system", action: "Firmware Update", target: "edge-router-01", time: "1h ago", status: "SUCCESS", ip: "127.0.0.1" },
  { id: "4", user: "admin@netpulse.io", action: "Changed Settings", target: "Auth Config", time: "3h ago", status: "SUCCESS", ip: "10.0.0.52" },
  { id: "5", user: "guest-user", action: "Access Denied", target: "Security Tab", time: "5h ago", status: "BLOCKED", ip: "172.16.0.12" },
];

export default function Security() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Security & Audit</h2>
          <p className="text-slate-500 mt-1">Monitor access logs, user actions, and system integrity.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl gap-2 border-slate-200">
            <Download className="w-4 h-4" />
            Export Logs
          </Button>
          <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl gap-2 shadow-lg shadow-brand-blue/20">
            <ShieldCheck className="w-4 h-4" />
            Run Security Scan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Security Score", value: "84/100", icon: Shield, color: "blue" },
          { label: "Failed Logins", value: "12", icon: AlertOctagon, color: "red" },
          { label: "Active Sessions", value: "4", icon: UserCheck, color: "emerald" },
          { label: "MFA Enabled", value: "100%", icon: Lock, color: "emerald" },
        ].map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm rounded-2xl bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-xl",
                  stat.color === "blue" && "bg-blue-50 text-blue-600",
                  stat.color === "red" && "bg-red-50 text-red-600",
                  stat.color === "emerald" && "bg-emerald-50 text-emerald-600",
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

      <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-white border-b border-slate-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search audit logs..." 
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
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-slate-700">User</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-700">Action</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-700">Target</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-700">Status</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-700">IP Address</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-700 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        {log.user.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-bold text-slate-900">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{log.action}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-mono">{log.target}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={cn(
                      "rounded-lg text-[10px] font-bold uppercase tracking-wider",
                      log.status === "SUCCESS" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                      log.status === "FAILED" ? "bg-red-50 text-red-600 border-red-100" : "bg-amber-50 text-amber-600 border-amber-100"
                    )}>
                      {log.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400 font-mono">{log.ip}</td>
                  <td className="px-6 py-4 text-sm text-slate-400 text-right">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
