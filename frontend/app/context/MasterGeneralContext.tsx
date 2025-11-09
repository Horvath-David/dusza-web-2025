import { createContext, useState, type ReactNode } from "react";

type MasterGeneralContextType = {
  worldId: number;
  setWorldId: (id: number) => void;
};

export const MasterGeneralContext = createContext<MasterGeneralContextType>({
  worldId: 0,
  setWorldId: () => {},
});

const MasterGeneralContextProvider = (props: { children: ReactNode }) => {
  const [worldId, setWorldId] = useState<number>(0);

  return (
    <MasterGeneralContext.Provider
      value={{
        worldId,
        setWorldId,
      }}
    >
      {props.children}
    </MasterGeneralContext.Provider>
  );
};

export default MasterGeneralContextProvider;
