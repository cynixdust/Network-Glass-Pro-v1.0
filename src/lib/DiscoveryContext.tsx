import React, { createContext, useContext, useState, useEffect } from "react";

export interface DiscoveryJob {
  id: string;
  name: string;
  range: string;
  status: "COMPLETED" | "RUNNING" | "SCHEDULED" | "STOPPED";
  lastRun: string;
  devicesFound: number;
  progress?: number;
}

interface DiscoveryContextType {
  jobs: DiscoveryJob[];
  addJob: (job: Omit<DiscoveryJob, "id" | "status" | "lastRun" | "devicesFound">) => void;
  updateJob: (id: string, job: Partial<DiscoveryJob>) => void;
  deleteJob: (id: string) => void;
  startJob: (id: string) => void;
  stopJob: (id: string) => void;
}

const DiscoveryContext = createContext<DiscoveryContextType | undefined>(undefined);

export function DiscoveryProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<DiscoveryJob[]>(() => {
    const saved = localStorage.getItem("app_discovery_jobs");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("app_discovery_jobs", JSON.stringify(jobs));
  }, [jobs]);

  const addJob = (job: Omit<DiscoveryJob, "id" | "status" | "lastRun" | "devicesFound">) => {
    const newJob: DiscoveryJob = {
      ...job,
      id: Math.random().toString(36).substr(2, 9),
      status: "SCHEDULED",
      lastRun: "Never",
      devicesFound: 0,
    };
    setJobs((prev) => [...prev, newJob]);
  };

  const updateJob = (id: string, updatedFields: Partial<DiscoveryJob>) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, ...updatedFields } : j))
    );
  };

  const deleteJob = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const startJob = (id: string) => {
    setJobs((prev) =>
      prev.map((j) => 
        j.id === id ? { ...j, status: "RUNNING", progress: 0 } : j
      )
    );
    
    // Simulate progress
    const interval = setInterval(() => {
      setJobs((prev) => {
        const job = prev.find(j => j.id === id);
        if (!job || job.status !== "RUNNING") {
          clearInterval(interval);
          return prev;
        }
        
        if ((job.progress || 0) >= 100) {
          clearInterval(interval);
          return prev.map(j => j.id === id ? { ...j, status: "COMPLETED", lastRun: "Just now", progress: 100 } : j);
        }
        
        return prev.map(j => j.id === id ? { ...j, progress: (j.progress || 0) + 10 } : j);
      });
    }, 1000);
  };

  const stopJob = (id: string) => {
    setJobs((prev) =>
      prev.map((j) => 
        j.id === id ? { ...j, status: "STOPPED" } : j
      )
    );
  };

  return (
    <DiscoveryContext.Provider value={{ jobs, addJob, updateJob, deleteJob, startJob, stopJob }}>
      {children}
    </DiscoveryContext.Provider>
  );
}

export function useDiscovery() {
  const context = useContext(DiscoveryContext);
  if (context === undefined) {
    throw new Error("useDiscovery must be used within a DiscoveryProvider");
  }
  return context;
}
