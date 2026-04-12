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
  lastScanned?: string;
}

interface IPAMContextType {
  subnets: Subnet[];
  addSubnet: (subnet: Omit<Subnet, "id" | "used" | "free" | "offline" | "reserved" | "status" | "lastScanned">) => void;
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
      prev.map((s) => (s.id === id ? { ...s, status: "SCANNING" } : s))
    );

    // Simulate network scan
    setTimeout(() => {
      setSubnets((prev) =>
        prev.map((s) => {
          if (s.id !== id) return s;
          
          // Generate realistic sparse stats (user mentioned having ~6 devices)
          const total = s.total;
          const used = Math.min(total, Math.floor(Math.random() * 5) + 3); // 3-8 devices
          const offline = Math.floor(Math.random() * 2); // 0-1 offline
          const reserved = 2; // Default reserved (gateway, etc)
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
            lastScanned: new Date().toLocaleString(),
          };
        })
      );
    }, 3000);
  };

  const addSubnet = (subnet: Omit<Subnet, "id" | "used" | "free" | "offline" | "reserved" | "status" | "lastScanned">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newSubnet: Subnet = {
      ...subnet,
      id,
      used: 0,
      free: 0,
      offline: 0,
      reserved: 0,
      status: "SCANNING",
    };
    setSubnets((prev) => [...prev, newSubnet]);
    
    // Automatically trigger scan
    scanSubnet(id);
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
