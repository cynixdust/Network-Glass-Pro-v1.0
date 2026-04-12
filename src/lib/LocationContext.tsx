import React, { createContext, useContext, useState, useEffect } from "react";

export interface LocationCategory {
  id: string;
  name: string;
  description?: string;
}

interface LocationContextType {
  locations: LocationCategory[];
  addLocation: (location: Omit<LocationCategory, "id">) => void;
  updateLocation: (id: string, location: Partial<LocationCategory>) => void;
  deleteLocation: (id: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [locations, setLocations] = useState<LocationCategory[]>([
    { id: "1", name: "Data Center A", description: "Primary production facility" },
    { id: "2", name: "Site B", description: "Secondary disaster recovery site" },
    { id: "3", name: "Office 1", description: "Main corporate headquarters" },
    { id: "4", name: "Cloud (AWS)", description: "AWS US-East-1 region" },
  ]);

  const addLocation = (location: Omit<LocationCategory, "id">) => {
    const newLocation = {
      ...location,
      id: Math.random().toString(36).substr(2, 9),
    };
    setLocations((prev) => [...prev, newLocation]);
  };

  const updateLocation = (id: string, updatedFields: Partial<LocationCategory>) => {
    setLocations((prev) =>
      prev.map((loc) => (loc.id === id ? { ...loc, ...updatedFields } : loc))
    );
  };

  const deleteLocation = (id: string) => {
    setLocations((prev) => prev.filter((loc) => loc.id !== id));
  };

  return (
    <LocationContext.Provider value={{ locations, addLocation, updateLocation, deleteLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocations() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocations must be used within a LocationProvider");
  }
  return context;
}
