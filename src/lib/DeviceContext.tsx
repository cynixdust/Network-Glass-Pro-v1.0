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

const INITIAL_DEVICES: Device[] = [];

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
