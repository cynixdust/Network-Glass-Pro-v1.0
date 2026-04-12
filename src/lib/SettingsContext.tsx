import React, { createContext, useContext, useState, useEffect } from "react";

interface SettingsContextType {
  logo: string | null;
  setLogo: (logo: string | null) => void;
  orgName: string;
  setOrgName: (name: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [logo, setLogoState] = useState<string | null>(() => {
    return localStorage.getItem("app_logo");
  });
  const [orgName, setOrgNameState] = useState<string>(() => {
    return localStorage.getItem("org_name") || "Network Glass Pro Enterprise";
  });

  const setLogo = (newLogo: string | null) => {
    setLogoState(newLogo);
    if (newLogo) {
      localStorage.setItem("app_logo", newLogo);
    } else {
      localStorage.removeItem("app_logo");
    }
  };

  const setOrgName = (newName: string) => {
    setOrgNameState(newName);
    localStorage.setItem("org_name", newName);
  };

  return (
    <SettingsContext.Provider value={{ logo, setLogo, orgName, setOrgName }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
