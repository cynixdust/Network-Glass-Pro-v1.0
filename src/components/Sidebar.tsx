import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Server, 
  AlertTriangle, 
  Network, 
  FileText, 
  Settings, 
  Shield, 
  Activity,
  ChevronRight,
  LogOut,
  Database,
  MapPin,
  Box,
  Wrench
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useAuth } from "@/src/lib/AuthContext";
import { useSettings } from "@/src/lib/SettingsContext";
import { Button } from "@/src/components/ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Server, label: "Devices", path: "/devices" },
  { icon: Network, label: "Topology", path: "/topology" },
  { icon: Box, label: "Rack Management", path: "/racks" },
  { icon: AlertTriangle, label: "Alerts", path: "/alerts" },
  { icon: Activity, label: "Discovery", path: "/discovery" },
  { icon: Database, label: "IPAM", path: "/ipam" },
  { icon: MapPin, label: "Locations", path: "/locations" },
  { icon: FileText, label: "Reports", path: "/reports" },
  { icon: Shield, label: "Security", path: "/security" },
  { icon: Wrench, label: "Tools", path: "/tools" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { logo } = useSettings();

  return (
    <div className="w-64 glass-sidebar h-screen flex flex-col text-white">
      <div className="p-6 flex items-center gap-4">
        <div className={cn(
          "flex items-center justify-center shadow-lg shadow-brand-blue/20 overflow-hidden shrink-0",
          logo ? "w-12 h-12 rounded-2xl bg-white p-1" : "w-10 h-10 bg-brand-blue rounded-xl"
        )}>
          {logo ? (
            <img src={logo} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          ) : (
            <Activity className="text-white w-6 h-6" />
          )}
        </div>
        <div className="flex flex-col justify-center min-w-0">
          <h1 className="font-bold text-lg leading-tight tracking-tight text-white truncate">
            Network Glass Pro
          </h1>
          <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold mt-0.5 leading-relaxed">
            Infrastructure glances<br />professional v1.0
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || "Admin User"}</p>
            <p className="text-[10px] text-slate-500 truncate uppercase">{user?.role || "Super Admin"}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-slate-400 hover:text-white hover:bg-white/5 gap-3 px-4 py-3 rounded-xl"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </Button>
      </div>
    </div>
  );
}
