import {
  createContext,
  useEffect,
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

const CardCollectionContextProvider = (props: { children: ReactNode }) => {
  const [collection, setCollection] = useState<CardType[]>([]);

  const modifyCard = (id: number, card: CardType) => {
    setCollection((prevCard) => {
      const newCards = prevCard.map((x) => (x.id === id ? card : x));
      return newCards;
    });
  };

  // useEffect(() => {
  //   if (!localStorage.getItem("collection")) return;
  //   setCollection(JSON.parse(localStorage.getItem("collection")!));
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem("collection", JSON.stringify(collection));
  // }, [collection]);

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
