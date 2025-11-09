import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

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
  setDungeons: Dispatch<SetStateAction<DungeonType[]>>;
};

export const DungeonContext = createContext<DungeonContextType>({
  dungeons: [],
  setDungeons: () => {},
});

const STORAGE_KEY = "dungeons";

const DungeonContextProvider = (props: { children: ReactNode }) => {
  const [dungeons, setDungeons] = useState<DungeonType[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as DungeonType[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dungeons));
    } catch {
      // ignore
    }
  }, [dungeons]);

  const value = useMemo(() => ({ dungeons, setDungeons }), [dungeons]);

  return (
    <DungeonContext.Provider value={value}>
      {props.children}
    </DungeonContext.Provider>
  );
};

export default DungeonContextProvider;
