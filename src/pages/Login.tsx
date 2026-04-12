import React, { useState } from "react";
import { useAuth } from "@/src/lib/AuthContext";
import { useSettings } from "@/src/lib/SettingsContext";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/src/components/ui/card";
import { Activity, Lock, Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/src/lib/utils";

export default function Login() {
  const { login } = useAuth();
  const { logo } = useSettings();
  const [email, setEmail] = useState("admin@netpulse.io");
  const [password, setPassword] = useState("password");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      login("dummy-token", {
        id: "1",
        email,
        name: "Admin User",
        role: "Super Admin"
      });
      toast.success("Welcome back, Admin!");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-brand-blue/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-brand-emerald/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden relative z-10">
        <CardHeader className="pt-12 pb-8 text-center">
          <div className={cn(
            "mx-auto mb-8 flex items-center justify-center shadow-2xl overflow-hidden transition-all",
            logo 
              ? "w-24 h-24 rounded-3xl bg-white p-2 shadow-slate-200/50" 
              : "w-20 h-20 bg-brand-blue rounded-2xl shadow-brand-blue/20"
          )}>
            {logo ? (
              <img src={logo} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            ) : (
              <Activity className="text-white w-10 h-10" />
            )}
          </div>
          <CardTitle className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
            Network Glass Pro
          </CardTitle>
          <CardDescription className="text-slate-400 mt-3 text-xs font-bold uppercase tracking-[0.2em]">
            Infrastructure glances professional v1.0
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@company.com" 
                  className="pl-10 h-12 rounded-xl bg-slate-50 border-none focus-visible:ring-brand-blue/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-xs font-bold text-brand-blue hover:underline">
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 h-12 rounded-xl bg-slate-50 border-none focus-visible:ring-brand-blue/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl font-bold shadow-lg shadow-brand-blue/20 transition-all active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="pb-10 pt-4 flex flex-col gap-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium tracking-wider">Or continue with</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            <Button variant="outline" className="rounded-xl border-slate-100 h-11 font-semibold text-slate-600">
              Google
            </Button>
            <Button variant="outline" className="rounded-xl border-slate-100 h-11 font-semibold text-slate-600">
              GitHub
            </Button>
          </div>
          <p className="text-center text-sm text-slate-500 mt-4">
            Don't have an account?{" "}
            <button className="font-bold text-brand-blue hover:underline">Request Access</button>
          </p>
        </CardFooter>
      </Card>
      
      <div className="fixed bottom-8 text-slate-400 text-xs font-medium">
        © 2026 Network Glass Pro Systems Inc. All rights reserved.
      </div>
    </div>
  );
}
