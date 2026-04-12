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
import { toast } from "sonner";

import { useDiscovery, DiscoveryJob } from "@/src/lib/DiscoveryContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import { Square, Trash2 as TrashIcon, Edit } from "lucide-react";

export default function Discovery() {
  const { jobs, addJob, updateJob, deleteJob, startJob, stopJob } = useDiscovery();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<DiscoveryJob | null>(null);
  const [formData, setFormData] = useState({ name: "", range: "" });

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    addJob(formData);
    setIsAddDialogOpen(false);
    setFormData({ name: "", range: "" });
    toast.success("Discovery job created.");
  };

  const handleEditJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingJob) {
      updateJob(editingJob.id, formData);
      setIsEditDialogOpen(false);
      setEditingJob(null);
      toast.success("Discovery job updated.");
    }
  };

  const openEditDialog = (job: DiscoveryJob) => {
    setEditingJob(job);
    setFormData({ name: job.name, range: job.range });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Network Discovery</h2>
          <p className="text-slate-500 mt-1">Automatically find and onboard new assets across your subnets.</p>
        </div>
        <Button 
          onClick={() => {
            setFormData({ name: "", range: "" });
            setIsAddDialogOpen(true);
          }}
          className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl gap-2 shadow-lg shadow-brand-blue/20"
        >
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
            <div className="text-2xl font-bold text-slate-900">
              {jobs.filter(j => j.status === "RUNNING").length}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {jobs.find(j => j.status === "RUNNING")?.range || "No active scans"}
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm rounded-2xl bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Devices Found (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {jobs.reduce((acc, j) => acc + j.devicesFound, 0)}
            </div>
            <p className="text-xs text-slate-400 mt-1">From all discovery jobs</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm rounded-2xl bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Subnets Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-blue">{jobs.length}</div>
            <p className="text-xs text-slate-400 mt-1">Configured discovery ranges</p>
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
            {jobs.length === 0 && (
              <div className="p-12 text-center">
                <Globe className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500">No discovery jobs configured. Create one to start scanning.</p>
              </div>
            )}
            {jobs.map((job) => (
              <div key={job.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-xl",
                    job.status === "RUNNING" ? "bg-blue-50 text-blue-600 animate-pulse" : 
                    job.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600" : 
                    job.status === "STOPPED" ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-400"
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
                  {job.status === "STOPPED" && (
                    <div className="flex items-center gap-2 text-red-500">
                      <Square className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Stopped</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{job.devicesFound} Devices</p>
                    <p className="text-xs text-slate-400">Last run: {job.lastRun}</p>
                  </div>
                  <div className="flex gap-2">
                    {job.status === "RUNNING" ? (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="rounded-lg border-red-200 bg-red-50 hover:bg-red-100"
                        onClick={() => {
                          stopJob(job.id);
                          toast.error(`Discovery job '${job.name}' stopped.`);
                        }}
                      >
                        <Square className="w-4 h-4 text-red-600 fill-red-600" />
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="rounded-lg border-slate-200"
                        onClick={() => {
                          startJob(job.id);
                          toast.success(`Discovery job '${job.name}' started.`);
                        }}
                      >
                        <Play className="w-4 h-4 text-slate-600" />
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-lg border-slate-200"
                      onClick={() => openEditDialog(job)}
                    >
                      <Settings className="w-4 h-4 text-slate-600" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Job Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl border-none shadow-2xl">
          <DialogHeader>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Plus className="w-6 h-6" />
            </div>
            <DialogTitle className="text-xl font-bold">New Discovery Job</DialogTitle>
            <DialogDescription>
              Configure a new network scan to find devices.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddJob} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Job Name</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Core Network Scan"
                required 
                className="rounded-xl bg-slate-50 border-none" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="range">IP Range (CIDR)</Label>
              <Input 
                id="range" 
                value={formData.range}
                onChange={(e) => setFormData(prev => ({ ...prev, range: e.target.value }))}
                placeholder="e.g. 10.0.0.0/24"
                required 
                className="rounded-xl bg-slate-50 border-none" 
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="rounded-xl border-slate-200">
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl min-w-[120px]">
                Create Job
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Job Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl border-none shadow-2xl">
          <DialogHeader>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Settings className="w-6 h-6" />
            </div>
            <DialogTitle className="text-xl font-bold">Job Settings</DialogTitle>
            <DialogDescription>
              Modify or delete this discovery job.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditJob} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Job Name</Label>
              <Input 
                id="edit-name" 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required 
                className="rounded-xl bg-slate-50 border-none" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-range">IP Range (CIDR)</Label>
              <Input 
                id="edit-range" 
                value={formData.range}
                onChange={(e) => setFormData(prev => ({ ...prev, range: e.target.value }))}
                required 
                className="rounded-xl bg-slate-50 border-none" 
              />
            </div>
            <DialogFooter className="pt-4 flex justify-between items-center sm:justify-between">
              <Button 
                type="button" 
                variant="ghost" 
                className="text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl gap-2"
                onClick={() => {
                  if (editingJob) {
                    deleteJob(editingJob.id);
                    setIsEditDialogOpen(false);
                    toast.success("Discovery job deleted.");
                  }
                }}
              >
                <TrashIcon className="w-4 h-4" />
                Delete Job
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl border-slate-200">
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl min-w-[120px]">
                  Save Changes
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
