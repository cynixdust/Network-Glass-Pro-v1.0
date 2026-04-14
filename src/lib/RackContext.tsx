import React, { createContext, useContext, useState, useEffect } from "react";

export interface Device {
  id: string;
  name: string;
  uPos: number;
  uSize: number;
  type: "SWITCH" | "SERVER" | "ROUTER" | "FIREWALL";
  color?: string;
}

export interface Rack {
  id: string;
  name: string;
  location: string;
  totalU: number;
  devices: Device[];
}

interface RackContextType {
  racks: Rack[];
  addRack: (rack: Omit<Rack, "id" | "devices">) => void;
  updateRack: (id: string, rack: Partial<Rack>) => void;
  deleteRack: (id: string) => void;
  addDeviceToRack: (rackId: string, device: Omit<Device, "id">) => void;
  removeDeviceFromRack: (rackId: string, deviceId: string) => void;
}

const initialRacks: Rack[] = [
  {
    id: "rack-1",
    name: "RACK-01-PROD",
    location: "Data Center A - Row 4",
    totalU: 42,
    devices: [
      { id: "d1", name: "Core Switch 01", uPos: 40, uSize: 2, type: "SWITCH", color: "#3b82f6" },
      { id: "d2", name: "Edge Router 01", uPos: 38, uSize: 1, type: "ROUTER", color: "#f59e0b" },
      { id: "d3", name: "Web Server 01", uPos: 10, uSize: 2, type: "SERVER", color: "#10b981" },
      { id: "d4", name: "DB Server 01", uPos: 12, uSize: 4, type: "SERVER", color: "#10b981" },
      { id: "d5", name: "Firewall HQ", uPos: 36, uSize: 1, type: "FIREWALL", color: "#ef4444" },
    ]
  },
  {
    id: "rack-2",
    name: "RACK-02-STORAGE",
    location: "Data Center A - Row 5",
    totalU: 42,
    devices: [
      { id: "d6", name: "Storage Array 01", uPos: 1, uSize: 4, type: "SERVER", color: "#6366f1" },
      { id: "d7", name: "Backup NAS", uPos: 5, uSize: 2, type: "SERVER", color: "#6366f1" },
      { id: "d8", name: "SAN Switch", uPos: 42, uSize: 1, type: "SWITCH", color: "#3b82f6" },
    ]
  }
];

const RackContext = createContext<RackContextType | undefined>(undefined);

export function RackProvider({ children }: { children: React.ReactNode }) {
  const [racks, setRacks] = useState<Rack[]>(() => {
    const saved = localStorage.getItem("app_racks");
    return saved ? JSON.parse(saved) : initialRacks;
  });

  useEffect(() => {
    localStorage.setItem("app_racks", JSON.stringify(racks));
  }, [racks]);

  const addRack = (rack: Omit<Rack, "id" | "devices">) => {
    const newRack: Rack = {
      ...rack,
      id: `rack-${Math.random().toString(36).substr(2, 9)}`,
      devices: []
    };
    setRacks(prev => [...prev, newRack]);
  };

  const updateRack = (id: string, updatedFields: Partial<Rack>) => {
    setRacks(prev => prev.map(r => r.id === id ? { ...r, ...updatedFields } : r));
  };

  const deleteRack = (id: string) => {
    setRacks(prev => prev.filter(r => r.id !== id));
  };

  const addDeviceToRack = (rackId: string, deviceFields: Omit<Device, "id">) => {
    const device: Device = {
      ...deviceFields,
      id: Math.random().toString(36).substr(2, 9)
    };
    setRacks(prev => prev.map(r => 
      r.id === rackId 
        ? { ...r, devices: [...r.devices, device] }
        : r
    ));
  };

  const removeDeviceFromRack = (rackId: string, deviceId: string) => {
    setRacks(prev => prev.map(r => 
      r.id === rackId 
        ? { ...r, devices: r.devices.filter(d => d.id !== deviceId) }
        : r
    ));
  };

  return (
    <RackContext.Provider value={{ racks, addRack, updateRack, deleteRack, addDeviceToRack, removeDeviceFromRack }}>
      {children}
    </RackContext.Provider>
  );
}

export function useRack() {
  const context = useContext(RackContext);
  if (context === undefined) {
    throw new Error("useRack must be used within a RackProvider");
  }
  return context;
}
