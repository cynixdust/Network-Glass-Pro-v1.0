import React from "react";
import { 
  Search, 
  Bell, 
  HelpCircle, 
  Plus,
  RefreshCw
} from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { AddDeviceDialog } from "@/src/components/AddDeviceDialog";

export function Navbar() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search devices, alerts, logs..." 
            className="pl-10 bg-slate-50 border-none focus-visible:ring-brand-blue/20 h-10 rounded-xl"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 mr-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Live</span>
        </div>
        <Button variant="outline" size="icon" className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </Button>
        <Button variant="outline" size="icon" className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50">
          <HelpCircle className="w-5 h-5" />
        </Button>
        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
        <AddDeviceDialog />
      </div>
    </header>
  );
}
