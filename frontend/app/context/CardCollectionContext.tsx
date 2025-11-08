import { createContext, useState, type ReactNode } from "react";

export type ElementsType = "fire" | "earth" | "water" | "wind";

export interface CardType {
  name: string;
  attack: number;
  health: number;
  type: ElementsType;
  isBoss: boolean;
}

interface CardCollectionContextType {
  collection: CardType[];
  setCollection: (cards: CardType[]) => void;
}

export const CardCollectionContext = createContext<CardCollectionContextType>({
  collection: [],
  setCollection: () => {},
});

const CardCollectionContextProvider = (props: { children: ReactNode }) => {
  const [collection, setCollection] = useState<CardType[]>([]);

  return (
    <CardCollectionContext.Provider
      value={{
        collection,
        setCollection,
      }}
    >
      {props.children}
    </CardCollectionContext.Provider>
  );
};

export default CardCollectionContextProvider;
