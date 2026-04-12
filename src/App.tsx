import React, { Suspense, lazy } from "react";
import { 
  HashRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { LocationProvider } from "./lib/LocationContext";
import { SettingsProvider } from "./lib/SettingsContext";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Loader2 } from "lucide-react";

// Lazy load pages for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Devices = lazy(() => import("./pages/Devices"));
const Topology = lazy(() => import("./pages/Topology"));
const Alerts = lazy(() => import("./pages/Alerts"));
const Discovery = lazy(() => import("./pages/Discovery"));
const Reports = lazy(() => import("./pages/Reports"));
const Security = lazy(() => import("./pages/Security"));
const IPAM = lazy(() => import("./pages/IPAM"));
const Settings = lazy(() => import("./pages/Settings"));
const Locations = lazy(() => import("./pages/Locations"));
const RackManagement = lazy(() => import("./pages/RackManagement"));
const DeviceDetail = lazy(() => import("./pages/DeviceDetail"));
const Tools = lazy(() => import("./pages/Tools"));
const Login = lazy(() => import("./pages/Login"));

function LoadingFallback() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-brand-blue animate-spin opacity-50" />
        <p className="text-sm font-medium text-slate-400 animate-pulse">Loading module...</p>
      </div>
    </div>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <Login />
      </Suspense>
    );
  }
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto content-area p-8">
          <Suspense fallback={<LoadingFallback />}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SettingsProvider>
          <AuthProvider>
            <LocationProvider>
              <Router>
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/devices" element={<Devices />} />
                    <Route path="/devices/:id" element={<DeviceDetail />} />
                    <Route path="/topology" element={<Topology />} />
                    <Route path="/alerts" element={<Alerts />} />
                    <Route path="/discovery" element={<Discovery />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/security" element={<Security />} />
                    <Route path="/ipam" element={<IPAM />} />
                    <Route path="/locations" element={<Locations />} />
                    <Route path="/racks" element={<RackManagement />} />
                    <Route path="/tools" element={<Tools />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </AppLayout>
                <Toaster position="top-right" />
              </Router>
            </LocationProvider>
          </AuthProvider>
        </SettingsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
