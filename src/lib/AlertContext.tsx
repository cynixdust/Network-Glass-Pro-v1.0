import React, { createContext, useContext, useState, useEffect } from "react";

export interface Alert {
  id: string;
  device: string;
  msg: string;
  time: string;
  severity: "critical" | "warning" | "info";
  status: "active" | "acknowledged" | "resolved";
}

interface AlertContextType {
  alerts: Alert[];
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  addAlert: (alert: Omit<Alert, "id" | "time" | "status">) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

const INITIAL_ALERTS: Alert[] = [
  { id: "1", device: "web-srv-01", msg: "High CPU usage detected (92%)", time: "2m ago", severity: "critical", status: "active" },
  { id: "2", device: "edge-router-01", msg: "Interface Gi0/1 status changed to DOWN", time: "15m ago", severity: "critical", status: "active" },
  { id: "3", device: "db-srv-01", msg: "Low disk space on /var/lib/mysql (5% remaining)", time: "1h ago", severity: "warning", status: "active" },
  { id: "4", device: "core-switch-02", msg: "Fan failure detected in slot 1", time: "3h ago", severity: "warning", status: "active" },
  { id: "5", device: "backup-nas", msg: "Scheduled backup failed: Connection timeout", time: "5h ago", severity: "warning", status: "acknowledged" },
  { id: "6", device: "ups-dc-01", msg: "Battery self-test passed", time: "1d ago", severity: "info", status: "resolved" },
];

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const saved = localStorage.getItem("app_alerts");
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  useEffect(() => {
    localStorage.setItem("app_alerts", JSON.stringify(alerts));
  }, [alerts]);

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "acknowledged" } : a))
    );
  };

  const resolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "resolved" } : a))
    );
  };

  const addAlert = (alert: Omit<Alert, "id" | "time" | "status">) => {
    const newAlert: Alert = {
      ...alert,
      id: Math.random().toString(36).substr(2, 9),
      time: "Just now",
      status: "active",
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  return (
    <AlertContext.Provider value={{ alerts, acknowledgeAlert, resolveAlert, addAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlerts must be used within an AlertProvider");
  }
  return context;
}
