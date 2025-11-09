import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";

type MasterGeneralContextType = {
  worldId: number;
  setWorldId: (id: number) => void;
};

export const MasterGeneralContext = createContext<MasterGeneralContextType>({
  worldId: 0,
  setWorldId: () => {},
});

const STORAGE_KEY = "world_id";

const MasterGeneralContextProvider = (props: { children: ReactNode }) => {
  const [worldId, setWorldId] = useState<number>(-1);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, String(worldId));
    } catch {}
  }, [worldId]);

  const value = useMemo(() => ({ worldId, setWorldId }), [worldId]);

  return (
    <MasterGeneralContext.Provider value={value}>
      {props.children}
    </MasterGeneralContext.Provider>
  );
};

export default MasterGeneralContextProvider;
