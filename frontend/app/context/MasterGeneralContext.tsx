import { createContext, useEffect, useState, type ReactNode } from "react";

type MasterGeneralContextType = {
  worldId: number;
  setWorldId: (id: number) => void;
};

export const MasterGeneralContext = createContext<MasterGeneralContextType>({
  worldId: 0,
  setWorldId: () => {},
});

const MasterGeneralContextProvider = (props: { children: ReactNode }) => {
  const [worldId, setWorldId] = useState<number>(-1);

  useEffect(() => {
    // if (localStorage.getItem("world_id") !== undefined)
    setWorldId(parseInt(localStorage.getItem("world_id")!));
  }, []);

  useEffect(() => {
    localStorage.setItem("world_id", worldId.toString());
    setWorldId(parseInt(localStorage.getItem("world_id")!));
    console.log(localStorage.getItem("world_id"));
  }, [worldId]);

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
