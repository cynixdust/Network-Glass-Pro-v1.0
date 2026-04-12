import React, { useState } from "react";
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Filter, 
  Search,
  MoreVertical,
  Check,
  Trash2,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";
import { toast } from "sonner";

const initialAlerts = [
  { id: "1", device: "web-srv-01", msg: "High CPU usage detected (92%)", time: "2m ago", severity: "critical", status: "active" },
  { id: "2", device: "edge-router-01", msg: "Interface Gi0/1 status changed to DOWN", time: "15m ago", severity: "critical", status: "active" },
  { id: "3", device: "db-srv-01", msg: "Low disk space on /var/lib/mysql (5% remaining)", time: "1h ago", severity: "warning", status: "active" },
  { id: "4", device: "core-switch-02", msg: "Fan failure detected in slot 1", time: "3h ago", severity: "warning", status: "active" },
  { id: "5", device: "backup-nas", msg: "Scheduled backup failed: Connection timeout", time: "5h ago", severity: "warning", status: "acknowledged" },
  { id: "6", device: "ups-dc-01", msg: "Battery self-test passed", time: "1d ago", severity: "info", status: "resolved" },
];

export default function Alerts() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filter, setFilter] = useState("all");

  const acknowledge = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: "acknowledged" } : a));
    toast.success("Alert acknowledged");
  };

  const resolve = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: "resolved" } : a));
    toast.success("Alert marked as resolved");
  };

  const filteredAlerts = alerts.filter(a => {
    if (filter === "all") return true;
    if (filter === "active") return a.status === "active";
    if (filter === "critical") return a.severity === "critical";
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Alerts & Events</h2>
          <p className="text-slate-500 mt-1">Real-time incident feed and system notifications.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl gap-2 border-slate-200">
            <Check className="w-4 h-4" />
            Acknowledge All
          </Button>
          <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl gap-2 shadow-lg shadow-brand-blue/20">
            Configure Rules
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { id: "all", label: "All Events", icon: Info, count: alerts.length },
                { id: "active", label: "Active Alerts", icon: AlertTriangle, count: alerts.filter(a => a.status === "active").length },
                { id: "critical", label: "Critical Only", icon: XCircle, count: alerts.filter(a => a.severity === "critical").length },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFilter(item.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all",
                    filter === item.id ? "bg-brand-blue text-white" : "hover:bg-slate-50 text-slate-600"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full",
                    filter === item.id ? "bg-white/20" : "bg-slate-100"
                  )}>{item.count}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-2xl bg-brand-blue text-white">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg">Alert Rules</h3>
              <p className="text-blue-100 text-xs mt-2 leading-relaxed">
                You have 12 active monitoring rules. 2 rules triggered in the last hour.
              </p>
              <Button variant="secondary" className="w-full mt-6 bg-white/10 hover:bg-white/20 border-none text-white rounded-xl">
                Manage Rules
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search alerts by device or message..." 
              className="pl-10 bg-white border-none shadow-sm h-12 rounded-2xl"
            />
          </div>

          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className={cn(
                "border-none shadow-sm rounded-2xl overflow-hidden transition-all duration-300",
                alert.status === "active" ? "bg-white" : "bg-slate-50/50 opacity-75"
              )}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <div className={cn(
                      "p-3 rounded-2xl shrink-0",
                      alert.severity === "critical" ? "bg-red-50 text-red-500" : 
                      alert.severity === "warning" ? "bg-amber-50 text-amber-500" : "bg-blue-50 text-blue-500"
                    )}>
                      {alert.severity === "critical" ? <XCircle className="w-6 h-6" /> : 
                       alert.severity === "warning" ? <AlertTriangle className="w-6 h-6" /> : <Info className="w-6 h-6" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-slate-900 truncate">{alert.device}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={cn(
                            "rounded-lg text-[10px] uppercase font-bold tracking-wider",
                            alert.status === "active" ? "border-red-200 text-red-600 bg-red-50" : 
                            alert.status === "acknowledged" ? "border-blue-200 text-blue-600 bg-blue-50" : "border-slate-200 text-slate-500 bg-slate-100"
                          )}>
                            {alert.status}
                          </Badge>
                          <span className="text-[10px] font-medium text-slate-400 uppercase flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {alert.time}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{alert.msg}</p>
                      
                      {alert.status === "active" && (
                        <div className="flex gap-3 mt-4">
                          <Button 
                            size="sm" 
                            onClick={() => acknowledge(alert.id)}
                            className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs h-8"
                          >
                            Acknowledge
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => resolve(alert.id)}
                            className="border-slate-200 text-slate-600 rounded-lg text-xs h-8"
                          >
                            Mark Resolved
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
