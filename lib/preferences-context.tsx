"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserPreferences, getUserPreferences, saveUserPreferences } from "./localStorage";

interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light',
    viewMode: 'week',
    notifications: true,
  });

  // Load preferences from localStorage on mount
  useEffect(() => {
    const storedPreferences = getUserPreferences();
    if (Object.keys(storedPreferences).length > 0) {
      setPreferences({
        ...preferences,
        ...storedPreferences
      });
    }
  }, []);

  // Update preferences
  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    const updatedPreferences = {
      ...preferences,
      ...newPreferences
    };
    
    setPreferences(updatedPreferences);
    saveUserPreferences(updatedPreferences);
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        updatePreferences,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

// Custom hook to use preferences context
export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
} 