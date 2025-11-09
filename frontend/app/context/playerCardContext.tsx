import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CardType } from "./CardCollectionContext";

// Define the context type
type PlayerDeckContextType = {
  playerDeck: CardType[];
  setPlayerDeck: React.Dispatch<React.SetStateAction<CardType[]>>;
};

// Create the context with a default value
export const PlayerDeckContext = createContext<PlayerDeckContextType>({
  playerDeck: [],
  setPlayerDeck: () => {},
});

// Create a provider component
export const PlayerDeckProvider = ({ children }: { children: ReactNode }) => {
  const [playerDeck, setPlayerDeck] = useState<CardType[]>([]);

  return (
    <PlayerDeckContext.Provider value={{ playerDeck, setPlayerDeck }}>
      {children}
    </PlayerDeckContext.Provider>
  );
};
