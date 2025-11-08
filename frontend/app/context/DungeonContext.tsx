import { createContext, useState, type ReactNode } from "react";

export type DungeonTypeType = "basic" | "small" | "big";

export type DungeonType = {
  id: number;
  name: string;
  cards: number[];
  world_id: number;
  type: DungeonTypeType;
};

type DungeonContextType = {
  dungeons: DungeonType[];
  setDungeons: (dun: DungeonType[]) => void;
};

export const DungeonContext = createContext<DungeonContextType>({
  dungeons: [],
  setDungeons: () => {},
});

const DungeonContextProvider = (props: { children: ReactNode }) => {
  const [dungeons, setDungeons] = useState<DungeonType[]>([]);
  return (
    <DungeonContext.Provider
      value={{
        dungeons,
        setDungeons,
      }}
    >
      {props.children}
    </DungeonContext.Provider>
  );
};

export default DungeonContextProvider;
