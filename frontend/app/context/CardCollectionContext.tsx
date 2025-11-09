import { createContext, useState, type ReactNode } from "react";

export type ElementsType = "fire" | "earth" | "water" | "air";

export interface CardType {
  id: number;
  name: string;
  attack: number;
  health: number;
  type: ElementsType;
  isBoss: boolean;
}

interface CardCollectionContextType {
  collection: CardType[];
  setCollection: (cards: CardType[]) => void;
  modifyCard: (id: number, card: CardType) => void;
}

export const CardCollectionContext = createContext<CardCollectionContextType>({
  collection: [],
  setCollection: () => {},
  modifyCard: () => {},
});

const CardCollectionContextProvider = (props: { children: ReactNode }) => {
  const [collection, setCollection] = useState<CardType[]>([]);

  const modifyCard = (id: number, card: CardType) => {
    setCollection((prevCard) => {
      const newCards = prevCard.map((x) => (x.id === id ? card : x));
      return newCards;
    });
  };

  return (
    <CardCollectionContext.Provider
      value={{
        collection,
        setCollection,
        modifyCard,
      }}
    >
      {props.children}
    </CardCollectionContext.Provider>
  );
};

export default CardCollectionContextProvider;
