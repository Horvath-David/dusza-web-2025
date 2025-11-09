import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

// Define the type for a card (you can adjust this as needed)
export type CardType = {
  id: string;
  suit: string;
  value: string;
};

// Define the context type
type PlayerDeckContextType = {
  playerDeck: CardType[];
  setPlayerDeck: React.Dispatch<React.SetStateAction<CardType[]>>;
};

// Create the context with a default value
const PlayerDeckContext = createContext<PlayerDeckContextType | undefined>(
  undefined
);

// Create a provider component
export const PlayerDeckProvider = ({ children }: { children: ReactNode }) => {
  const [playerDeck, setPlayerDeck] = useState<CardType[]>([]);

  return (
    <PlayerDeckContext.Provider value={{ playerDeck, setPlayerDeck }}>
      {children}
    </PlayerDeckContext.Provider>
  );
};
