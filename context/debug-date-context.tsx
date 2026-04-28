import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

const DEBUG_MODE_KEY = "debug_mode_enabled";

type DebugDateContextType = {
  debugModeEnabled: boolean;
  setDebugModeEnabled: (v: boolean) => void;
  today: Date;
  shiftDay: (delta: number) => void;
};

const DebugDateContext = createContext<DebugDateContextType>({
  debugModeEnabled: false,
  setDebugModeEnabled: () => {},
  today: new Date(),
  shiftDay: () => {},
});

export function DebugDateProvider({ children }: { children: ReactNode }) {
  const [debugModeEnabled, setDebugModeEnabledState] = useState(false);
  const [debugDate, setDebugDate] = useState<Date | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(DEBUG_MODE_KEY).then((val) => {
      if (val === "true") setDebugModeEnabledState(true);
    });
  }, []);

  const setDebugModeEnabled = (v: boolean) => {
    setDebugModeEnabledState(v);
    AsyncStorage.setItem(DEBUG_MODE_KEY, v ? "true" : "false");
    if (!v) setDebugDate(null);
  };

  const shiftDay = (delta: number) => {
    setDebugDate((prev) => {
      const base = prev ?? new Date();
      const next = new Date(base);
      next.setDate(next.getDate() + delta);
      return next;
    });
  };

  const today = debugDate ?? new Date();

  return (
    <DebugDateContext.Provider value={{ debugModeEnabled, setDebugModeEnabled, today, shiftDay }}>
      {children}
    </DebugDateContext.Provider>
  );
}

export const useDebugDate = () => useContext(DebugDateContext);
