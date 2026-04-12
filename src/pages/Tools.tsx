import React, { useState } from "react";
import { 
  Wrench, 
  Search, 
  Terminal, 
  Globe, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Network,
  Play,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Progress } from "@/src/components/ui/progress";
import { cn } from "@/src/lib/utils";
import { toast } from "sonner";

export default function Tools() {
  const [pingTarget, setPingTarget] = useState("8.8.8.8");
  const [isPinging, setIsPinging] = useState(false);
  const [pingResults, setPingResults] = useState<{ seq: number; time: number; status: string }[]>([]);
  
  const [scanTarget, setScanTarget] = useState("192.168.1.1");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState<{ port: number; service: string; status: string }[]>([]);

  const runPing = () => {
    if (!pingTarget) return;
    setIsPinging(true);
    setPingResults([]);
    
    let count = 0;
    const interval = setInterval(() => {
      count++;
      const success = Math.random() > 0.1;
      const newResult = {
        seq: count,
        time: success ? Math.floor(Math.random() * 50) + 10 : 0,
        status: success ? "SUCCESS" : "TIMEOUT"
      };
      
      setPingResults(prev => [newResult, ...prev].slice(0, 10));
      
      if (count >= 4) {
        clearInterval(interval);
        setIsPinging(false);
        toast.success(`Ping to ${pingTarget} completed`);
      }
    }, 1000);
  };

  const runScan = () => {
    if (!scanTarget) return;
    setIsScanning(true);
    setScanProgress(0);
    setScanResults([]);
    
    const commonPorts = [
      { port: 22, service: "SSH" },
      { port: 80, service: "HTTP" },
      { port: 443, service: "HTTPS" },
      { port: 3306, service: "MySQL" },
      { port: 5432, service: "PostgreSQL" },
      { port: 8080, service: "HTTP-ALT" }
    ];

    let currentPortIndex = 0;
    const interval = setInterval(() => {
      if (currentPortIndex < commonPorts.length) {
        const portInfo = commonPorts[currentPortIndex];
        const isOpen = Math.random() > 0.5;
        
        setScanResults(prev => [...prev, { ...portInfo, status: isOpen ? "OPEN" : "CLOSED" }]);
        setScanProgress(((currentPortIndex + 1) / commonPorts.length) * 100);
        currentPortIndex++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
        toast.success(`Port scan for ${scanTarget} completed`);
      }
    }, 600);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Network Utilities</h2>
        <p className="text-slate-500 mt-1">Diagnostic tools for infrastructure troubleshooting and verification.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="ping" className="space-y-6">
            <TabsList className="bg-white border border-slate-200 p-1 rounded-xl h-12">
              <TabsTrigger value="ping" className="rounded-lg px-6 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 gap-2">
                <Zap className="w-4 h-4" />
                Ping Test
              </TabsTrigger>
              <TabsTrigger value="scan" className="rounded-lg px-6 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 gap-2">
                <Search className="w-4 h-4" />
                Port Scanner
              </TabsTrigger>
              <TabsTrigger value="dns" className="rounded-lg px-6 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 gap-2">
                <Globe className="w-4 h-4" />
                DNS Lookup
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ping" className="space-y-6">
              <Card className="border-none shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle>ICMP Ping</CardTitle>
                  <CardDescription>Check host reachability and round-trip time.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="ping-target">Target IP or Hostname</Label>
                      <Input 
                        id="ping-target" 
                        value={pingTarget} 
                        onChange={(e) => setPingTarget(e.target.value)}
                        placeholder="e.g. 8.8.8.8" 
                        className="rounded-xl"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button 
                        onClick={runPing} 
                        disabled={isPinging}
                        className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl gap-2 h-10 px-6"
                      >
                        {isPinging ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        Run Test
                      </Button>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-2xl p-6 font-mono text-sm text-emerald-400 min-h-[200px] shadow-inner">
                    <div className="flex items-center gap-2 mb-4 text-slate-400 border-b border-slate-800 pb-2">
                      <Terminal className="w-4 h-4" />
                      <span>Console Output</span>
                    </div>
                    {pingResults.length === 0 && !isPinging && (
                      <p className="text-slate-600 italic">Enter a target and click "Run Test" to begin...</p>
                    )}
                    {isPinging && pingResults.length === 0 && (
                      <p className="animate-pulse">Pinging {pingTarget} with 32 bytes of data...</p>
                    )}
                    <div className="space-y-1">
                      {pingResults.map((res, i) => (
                        <div key={i} className="flex justify-between">
                          <span>Reply from {pingTarget}: bytes=32 seq={res.seq} time={res.time}ms</span>
                          <span className={cn(
                            "font-bold",
                            res.status === "SUCCESS" ? "text-emerald-400" : "text-red-400"
                          )}>{res.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scan" className="space-y-6">
              <Card className="border-none shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle>Port Scanner</CardTitle>
                  <CardDescription>Scan common ports to identify active services.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="scan-target">Target IP Address</Label>
                      <Input 
                        id="scan-target" 
                        value={scanTarget} 
                        onChange={(e) => setScanTarget(e.target.value)}
                        placeholder="e.g. 192.168.1.1" 
                        className="rounded-xl"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button 
                        onClick={runScan} 
                        disabled={isScanning}
                        className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl gap-2 h-10 px-6"
                      >
                        {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        Start Scan
                      </Button>
                    </div>
                  </div>

                  {isScanning && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase text-slate-500">
                        <span>Scanning Ports...</span>
                        <span>{Math.round(scanProgress)}%</span>
                      </div>
                      <Progress value={scanProgress} className="h-2 bg-slate-100" />
                    </div>
                  )}

                  <div className="border border-slate-100 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className="text-left p-4 font-bold text-slate-600">Port</th>
                          <th className="text-left p-4 font-bold text-slate-600">Service</th>
                          <th className="text-right p-4 font-bold text-slate-600">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {scanResults.length === 0 && !isScanning && (
                          <tr>
                            <td colSpan={3} className="p-8 text-center text-slate-400 italic">
                              No scan results yet.
                            </td>
                          </tr>
                        )}
                        {scanResults.map((res, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 font-mono font-bold text-slate-900">{res.port}</td>
                            <td className="p-4 text-slate-600">{res.service}</td>
                            <td className="p-4 text-right">
                              <span className={cn(
                                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                                res.status === "OPEN" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                              )}>
                                {res.status === "OPEN" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                {res.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-sm rounded-2xl bg-brand-blue text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldCheck className="w-32 h-32" />
            </div>
            <CardHeader>
              <CardTitle className="text-white">System Health</CardTitle>
              <CardDescription className="text-blue-100">Real-time platform performance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    <span className="text-sm font-medium">CPU Usage</span>
                  </div>
                  <span className="text-sm font-bold">12%</span>
                </div>
                <Progress value={12} className="h-1.5 bg-white/20" />
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Network className="w-4 h-4" />
                    <span className="text-sm font-medium">Network Load</span>
                  </div>
                  <span className="text-sm font-bold">4.2 MB/s</span>
                </div>
                <Progress value={45} className="h-1.5 bg-white/20" />
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Uptime</span>
                  </div>
                  <span className="text-sm font-bold">14d 6h 22m</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">All Systems Operational</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start rounded-xl border-slate-100 gap-3 text-slate-600">
                <FileText className="w-4 h-4 text-slate-400" />
                Documentation
              </Button>
              <Button variant="outline" className="w-full justify-start rounded-xl border-slate-100 gap-3 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                Security Audit
              </Button>
              <Button variant="outline" className="w-full justify-start rounded-xl border-slate-100 gap-3 text-slate-600">
                <Terminal className="w-4 h-4 text-slate-400" />
                API Explorer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
