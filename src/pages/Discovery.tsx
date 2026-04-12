import React, { useState } from "react";
import { 
  Search, 
  Play, 
  Plus, 
  History, 
  Settings, 
  Globe, 
  Network, 
  CheckCircle2, 
  Clock,
  MoreHorizontal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";

const discoveryJobs = [
  { id: "1", name: "Core Network Scan", range: "10.0.0.0/24", status: "COMPLETED", lastRun: "2h ago", devicesFound: 42 },
  { id: "2", name: "Office WiFi Discovery", range: "192.168.2.0/24", status: "RUNNING", lastRun: "Now", devicesFound: 15, progress: 65 },
  { id: "3", name: "DMZ Audit", range: "172.16.0.0/24", status: "SCHEDULED", lastRun: "1d ago", devicesFound: 0 },
];

export default function Discovery() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Network Discovery</h2>
          <p className="text-slate-500 mt-1">Automatically find and onboard new assets across your subnets.</p>
        </div>
        <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl gap-2 shadow-lg shadow-brand-blue/20">
          <Plus className="w-4 h-4" />
          New Scan Job
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm rounded-2xl bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">1</div>
            <p className="text-xs text-slate-400 mt-1">Scanning 192.168.2.0/24</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm rounded-2xl bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Devices Found (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">57</div>
            <p className="text-xs text-slate-400 mt-1">12 new assets identified</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm rounded-2xl bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Subnets Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-blue">14</div>
            <p className="text-xs text-slate-400 mt-1">Across 3 physical sites</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-lg font-bold">Discovery Jobs</CardTitle>
          <CardDescription>Manage automated network scanning schedules.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-50">
            {discoveryJobs.map((job) => (
              <div key={job.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-xl",
                    job.status === "RUNNING" ? "bg-blue-50 text-blue-600 animate-pulse" : 
                    job.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
                  )}>
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{job.name}</h4>
                    <p className="text-sm text-slate-500 font-mono">{job.range}</p>
                  </div>
                </div>

                <div className="flex-1 max-w-xs mx-8">
                  {job.status === "RUNNING" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-500">Scanning...</span>
                        <span className="text-brand-blue">{job.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-brand-blue h-full transition-all duration-500" 
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {job.status === "COMPLETED" && (
                    <div className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
                    </div>
                  )}
                  {job.status === "SCHEDULED" && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Scheduled</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{job.devicesFound} Devices</p>
                    <p className="text-xs text-slate-400">Last run: {job.lastRun}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-lg border-slate-200">
                      <Play className="w-4 h-4 text-slate-600" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-lg border-slate-200">
                      <Settings className="w-4 h-4 text-slate-600" />
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
