import React, { useRef } from "react";
import { 
  Settings as SettingsIcon, 
  Database, 
  Shield, 
  Mail, 
  Bell, 
  Users, 
  Key, 
  Globe,
  Save,
  RefreshCw,
  Palette,
  Sun,
  Moon,
  Monitor,
  Upload,
  Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Switch } from "@/src/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { cn } from "@/src/lib/utils";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { useSettings } from "@/src/lib/SettingsContext";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { logo, setLogo, orgName, setOrgName } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size exceeds 2MB limit");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
        toast.success("Logo uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogo(null);
    toast.success("Logo removed");
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">System Settings</h2>
        <p className="text-slate-500 mt-1">Configure platform authentication, database, and monitoring parameters.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-white border border-slate-200 p-1 rounded-xl h-12">
          <TabsTrigger value="general" className="rounded-lg px-6 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">General</TabsTrigger>
          <TabsTrigger value="auth" className="rounded-lg px-6 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">Authentication</TabsTrigger>
          <TabsTrigger value="database" className="rounded-lg px-6 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">Database</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg px-6 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">Notifications</TabsTrigger>
          <TabsTrigger value="production" className="rounded-lg px-6 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">Optimization</TabsTrigger>
          <TabsTrigger value="themes" className="rounded-lg px-6 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="border-none shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle>Platform Configuration</CardTitle>
              <CardDescription>Basic system settings and polling intervals.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 bg-white rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-brand-blue hover:text-brand-blue cursor-pointer transition-all overflow-hidden"
                >
                  {logo ? (
                    <img src={logo} alt="Logo" className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
                  ) : (
                    <>
                      <Palette className="w-6 h-6" />
                      <span className="text-[10px] font-bold uppercase">Logo</span>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/png, image/jpeg" 
                  onChange={handleLogoUpload}
                />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900">Platform Logo</h4>
                  <p className="text-xs text-slate-500">Upload a PNG or JPG logo (max 2MB). Recommended size 512x512px.</p>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-lg h-8 text-xs font-bold border-slate-200 gap-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-3 h-3" />
                      Upload New
                    </Button>
                    {logo && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-lg h-8 text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 gap-2"
                        onClick={removeLogo}
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Organization Name</Label>
                  <Input 
                    id="site-name" 
                    value={orgName} 
                    onChange={(e) => setOrgName(e.target.value)}
                    className="rounded-xl" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="base-url">Base URL</Label>
                  <Input id="base-url" defaultValue="https://monitor.networkglass.pro" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="poll-interval">Default Polling Interval (seconds)</Label>
                  <Input id="poll-interval" type="number" defaultValue="60" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retention">Data Retention (days)</Label>
                  <Input id="retention" type="number" defaultValue="30" className="rounded-xl" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-xs text-slate-500">Disable all polling and alerts during maintenance.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auth" className="space-y-6">
          <Card className="border-none shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle>Authentication Providers</CardTitle>
              <CardDescription>Configure how users access the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Local Authentication</p>
                      <p className="text-xs text-slate-500">Standard email and password login.</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">LDAP / Active Directory</p>
                      <p className="text-xs text-slate-500">Sync users from your corporate directory.</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="font-bold text-sm">LDAP Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Server Host</Label>
                    <Input placeholder="ldap.company.com" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Port</Label>
                    <Input defaultValue="389" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Base DN</Label>
                    <Input placeholder="dc=company,dc=com" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Bind User</Label>
                    <Input placeholder="cn=admin,dc=company,dc=com" className="rounded-xl" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <Card className="border-none shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle>Database Connection</CardTitle>
              <CardDescription>Manage your primary data storage.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Database Type</Label>
                <Select defaultValue="sqlite">
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select database" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sqlite">SQLite (Local File)</SelectItem>
                    <SelectItem value="postgres">PostgreSQL</SelectItem>
                    <SelectItem value="mysql">MySQL / MariaDB</SelectItem>
                    <SelectItem value="mongodb">MongoDB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-bold text-emerald-900">Connected to SQLite</p>
                    <p className="text-xs text-emerald-700">File: ./dev.db (Healthy)</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50 gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="production" className="space-y-6">
          <Card className="border-none shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle>Production Tuning</CardTitle>
              <CardDescription>Optimize platform performance and reliability for enterprise environments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
                  <div className="space-y-0.5">
                    <Label>Client-side Caching</Label>
                    <p className="text-xs text-slate-500">Cache device data locally to reduce API overhead.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
                  <div className="space-y-0.5">
                    <Label>Detailed Audit Logging</Label>
                    <p className="text-xs text-slate-500">Log all administrative actions for compliance.</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
                  <div className="space-y-0.5">
                    <Label>Automatic Backups</Label>
                    <p className="text-xs text-slate-500">Daily snapshot of IPAM and device configuration.</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
                  <div className="space-y-0.5">
                    <Label>Performance Monitoring</Label>
                    <p className="text-xs text-slate-500">Collect and display system health metrics.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-sm mb-4">Cache Management</h4>
                <div className="flex gap-3">
                  <Button variant="outline" className="rounded-xl text-xs font-bold border-slate-200">Clear Device Cache</Button>
                  <Button variant="outline" className="rounded-xl text-xs font-bold border-slate-200">Rebuild Search Index</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="themes" className="space-y-6">
          <Card className="border-none shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle>Appearance & Theme</CardTitle>
              <CardDescription>Customize the visual style of the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <Label>Color Mode</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div 
                    onClick={() => setTheme("light")}
                    className={cn(
                      "relative cursor-pointer group transition-all",
                      theme === "light" ? "opacity-100" : "opacity-50 hover:opacity-100"
                    )}
                  >
                    <div className={cn(
                      "aspect-video rounded-xl border-2 bg-white p-2 shadow-sm",
                      theme === "light" ? "border-brand-blue" : "border-transparent"
                    )}>
                      <div className="flex gap-1 mb-2">
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                      </div>
                      <div className="space-y-1">
                        <div className="h-1 w-full bg-slate-100 rounded" />
                        <div className="h-1 w-2/3 bg-slate-100 rounded" />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <Sun className={cn("w-3 h-3", theme === "light" ? "text-brand-blue" : "text-slate-500")} />
                      <span className={cn("text-xs font-bold", theme === "light" ? "text-slate-900" : "text-slate-500")}>Light</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => setTheme("dark")}
                    className={cn(
                      "relative cursor-pointer group transition-all",
                      theme === "dark" ? "opacity-100" : "opacity-50 hover:opacity-100"
                    )}
                  >
                    <div className={cn(
                      "aspect-video rounded-xl border-2 bg-slate-900 p-2 shadow-sm",
                      theme === "dark" ? "border-brand-blue" : "border-transparent"
                    )}>
                      <div className="flex gap-1 mb-2">
                        <div className="w-2 h-2 rounded-full bg-slate-800" />
                        <div className="w-2 h-2 rounded-full bg-slate-800" />
                      </div>
                      <div className="space-y-1">
                        <div className="h-1 w-full bg-slate-800 rounded" />
                        <div className="h-1 w-2/3 bg-slate-800 rounded" />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <Moon className={cn("w-3 h-3", theme === "dark" ? "text-brand-blue" : "text-slate-500")} />
                      <span className={cn("text-xs font-bold", theme === "dark" ? "text-slate-900" : "text-slate-500")}>Dark</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => setTheme("system")}
                    className={cn(
                      "relative cursor-pointer group transition-all",
                      theme === "system" ? "opacity-100" : "opacity-50 hover:opacity-100"
                    )}
                  >
                    <div className={cn(
                      "aspect-video rounded-xl border-2 bg-slate-100 p-2 shadow-sm overflow-hidden",
                      theme === "system" ? "border-brand-blue" : "border-transparent"
                    )}>
                      <div className="flex h-full">
                        <div className="w-1/2 bg-white" />
                        <div className="w-1/2 bg-slate-900" />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <Monitor className={cn("w-3 h-3", theme === "system" ? "text-brand-blue" : "text-slate-500")} />
                      <span className={cn("text-xs font-bold", theme === "system" ? "text-slate-900" : "text-slate-500")}>System</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Accent Color</Label>
                <div className="flex gap-4">
                  {["#2563EB", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"].map((color) => (
                    <div 
                      key={color}
                      className={cn(
                        "w-8 h-8 rounded-full cursor-pointer border-2 transition-transform hover:scale-110",
                        color === "#2563EB" ? "border-slate-900" : "border-transparent"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="space-y-0.5">
                  <Label>Compact Mode</Label>
                  <p className="text-xs text-slate-500">Reduce padding and font sizes for high-density displays.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="flex justify-end gap-3">
        <Button variant="outline" className="rounded-xl border-slate-200">Cancel</Button>
        <Button onClick={handleSave} className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl gap-2 shadow-lg shadow-brand-blue/20">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
