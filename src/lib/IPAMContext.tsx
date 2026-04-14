import React, { createContext, useContext, useState, useEffect } from "react";

export interface Subnet {
  id: string;
  network: string;
  name: string;
  used: number;
  free: number;
  offline: number;
  reserved: number;
  total: number;
  site: string;
  status: "HEALTHY" | "WARNING" | "CRITICAL" | "SCANNING";
  scanProgress?: number;
  lastScanned?: string;
}

interface IPAMContextType {
  subnets: Subnet[];
  addSubnet: (subnet: Omit<Subnet, "id" | "used" | "free" | "offline" | "reserved" | "status" | "lastScanned" | "scanProgress">) => void;
  updateSubnet: (id: string, subnet: Partial<Subnet>) => void;
  deleteSubnet: (id: string) => void;
  scanSubnet: (id: string) => void;
}

const IPAMContext = createContext<IPAMContextType | undefined>(undefined);

export function IPAMProvider({ children }: { children: React.ReactNode }) {
  const [subnets, setSubnets] = useState<Subnet[]>(() => {
    const saved = localStorage.getItem("app_subnets");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("app_subnets", JSON.stringify(subnets));
  }, [subnets]);

  const scanSubnet = (id: string) => {
    setSubnets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "SCANNING", scanProgress: 0 } : s))
    );

    // Simulate network scan with progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setSubnets((prev) =>
          prev.map((s) => {
            if (s.id !== id) return s;
            
            const total = s.total;
            // Simulate finding more devices (15-45) if the subnet is large enough
            const maxUsed = Math.min(total - 5, 45);
            const used = Math.min(total, Math.floor(Math.random() * (maxUsed - 15 + 1)) + 15); 
            const offline = Math.floor(Math.random() * 5); 
            const reserved = Math.min(total - used - offline, 5); 
            const free = total - used - offline - reserved;
            
            const utilization = used / total;
            const status = utilization > 0.9 ? "CRITICAL" : utilization > 0.7 ? "WARNING" : "HEALTHY";

            return {
              ...s,
              used,
              free,
              offline,
              reserved,
              status,
              scanProgress: undefined,
              lastScanned: new Date().toLocaleString(),
            };
          })
        );
      } else {
        setSubnets((prev) =>
          prev.map((s) => (s.id === id ? { ...s, scanProgress: progress } : s))
        );
      }
    }, 400);
  };

  const addSubnet = (subnet: Omit<Subnet, "id" | "used" | "free" | "offline" | "reserved" | "status" | "lastScanned" | "scanProgress">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newSubnet: Subnet = {
      ...subnet,
      id,
      used: 0,
      free: 0,
      offline: 0,
      reserved: 0,
      status: "SCANNING",
      scanProgress: 0,
    };
    setSubnets((prev) => [...prev, newSubnet]);
    
    // Automatically trigger scan in next tick to ensure state is updated
    setTimeout(() => scanSubnet(id), 0);
  };

  const updateSubnet = (id: string, updatedFields: Partial<Subnet>) => {
    setSubnets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
    );
  };

  const deleteSubnet = (id: string) => {
    setSubnets((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <IPAMContext.Provider value={{ subnets, addSubnet, updateSubnet, deleteSubnet, scanSubnet }}>
      {children}
    </IPAMContext.Provider>
  );
}

export function useIPAM() {
  const context = useContext(IPAMContext);
  if (context === undefined) {
    throw new Error("useIPAM must be used within an IPAMProvider");
  }
  return context;
}
