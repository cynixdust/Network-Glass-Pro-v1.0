import React, { createContext, useContext, useState, useEffect } from "react";

export interface Device {
  id: string;
  hostname: string;
  ip: string;
  type: string;
  status: "UP" | "WARNING" | "DOWN";
  location: string;
  lastSeen: string;
}

interface DeviceContextType {
  devices: Device[];
  addDevice: (device: Omit<Device, "id" | "lastSeen">) => void;
  updateDevice: (id: string, device: Partial<Device>) => void;
  deleteDevice: (id: string) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

const INITIAL_DEVICES: Device[] = [
  { id: "1", hostname: "core-switch-01", ip: "10.0.0.1", type: "SWITCH", status: "UP", location: "Data Center A", lastSeen: "2m ago" },
  { id: "2", hostname: "edge-router-01", ip: "10.0.0.254", type: "ROUTER", status: "UP", location: "Data Center A", lastSeen: "5m ago" },
  { id: "3", hostname: "web-srv-01", ip: "192.168.1.10", type: "SERVER", status: "WARNING", location: "Site B", lastSeen: "1m ago" },
  { id: "4", hostname: "db-srv-01", ip: "192.168.1.20", type: "SERVER", status: "UP", location: "Site B", lastSeen: "10m ago" },
  { id: "5", hostname: "backup-nas", ip: "192.168.1.50", type: "SERVER", status: "DOWN", location: "Site B", lastSeen: "2h ago" },
  { id: "6", hostname: "firewall-hq", ip: "10.0.0.5", type: "FIREWALL", status: "UP", location: "Data Center A", lastSeen: "30s ago" },
  { id: "7", hostname: "wifi-ap-01", ip: "192.168.2.1", type: "IOT", status: "UP", location: "Office 1", lastSeen: "4m ago" },
  { id: "8", hostname: "wifi-ap-02", ip: "192.168.2.2", type: "IOT", status: "WARNING", location: "Office 2", lastSeen: "8m ago" },
];

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<Device[]>(() => {
    const saved = localStorage.getItem("app_devices");
    return saved ? JSON.parse(saved) : INITIAL_DEVICES;
  });

  useEffect(() => {
    localStorage.setItem("app_devices", JSON.stringify(devices));
  }, [devices]);

  const addDevice = (device: Omit<Device, "id" | "lastSeen">) => {
    const newDevice: Device = {
      ...device,
      id: Math.random().toString(36).substr(2, 9),
      lastSeen: "Just now",
    };
    setDevices((prev) => [...prev, newDevice]);
  };

  const updateDevice = (id: string, updatedFields: Partial<Device>) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updatedFields } : d))
    );
  };

  const deleteDevice = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <DeviceContext.Provider value={{ devices, addDevice, updateDevice, deleteDevice }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevices() {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error("useDevices must be used within a DeviceProvider");
  }
  return context;
}
