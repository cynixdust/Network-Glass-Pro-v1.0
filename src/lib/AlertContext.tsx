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

const INITIAL_ALERTS: Alert[] = [];

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
