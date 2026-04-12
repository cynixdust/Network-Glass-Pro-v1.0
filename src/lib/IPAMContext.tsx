import React, { createContext, useContext, useState, useEffect } from "react";

export interface Subnet {
  id: string;
  network: string;
  name: string;
  used: number;
  total: number;
  site: string;
  status: "HEALTHY" | "WARNING" | "CRITICAL";
}

interface IPAMContextType {
  subnets: Subnet[];
  addSubnet: (subnet: Omit<Subnet, "id" | "used" | "status">) => void;
  updateSubnet: (id: string, subnet: Partial<Subnet>) => void;
  deleteSubnet: (id: string) => void;
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

  const addSubnet = (subnet: Omit<Subnet, "id" | "used" | "status">) => {
    const newSubnet: Subnet = {
      ...subnet,
      id: Math.random().toString(36).substr(2, 9),
      used: 0,
      status: "HEALTHY",
    };
    setSubnets((prev) => [...prev, newSubnet]);
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
    <IPAMContext.Provider value={{ subnets, addSubnet, updateSubnet, deleteSubnet }}>
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
