import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { toast } from "sonner";
import { API_URL } from "~/constants";

export type ElementsType = "fire" | "earth" | "water" | "air";

export interface CardType {
  id: number;
  name: string;
  attack: number;
  hp: number;
  type: ElementsType;
  is_boss: boolean;
}

interface CardCollectionContextType {
  collection: CardType[];
  setCollection: Dispatch<SetStateAction<CardType[]>>;
  modifyCard: (id: number, card: CardType) => void;
}

export const CardCollectionContext = createContext<CardCollectionContextType>({
  collection: [],
  setCollection: () => {},
  modifyCard: () => {},
});

const STORAGE_KEY = "collection";

const CardCollectionContextProvider = (props: { children: ReactNode }) => {
  const [collection, setCollection] = useState<CardType[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CardType[]) : [];
    } catch {
      return [];
    }
  });

  const modifyCard = (id: number, card: CardType) => {
    setCollection((prev) => prev.map((x) => (x.id === id ? card : x)));
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
    } catch {
      // ignore quota errors
    }
  }, [collection]);

  const value = useMemo(
    () => ({ collection, setCollection, modifyCard }),
    [collection]
  );

  return (
    <CardCollectionContext.Provider value={value}>
      {props.children}
    </CardCollectionContext.Provider>
  );
};

export default CardCollectionContextProvider;
