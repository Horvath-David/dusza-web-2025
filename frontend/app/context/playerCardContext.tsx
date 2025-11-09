import React, {
  createContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CardType } from "./CardCollectionContext";

type PlayerDeckContextType = {
  playerDeck: CardType[];
  setPlayerDeck: React.Dispatch<React.SetStateAction<CardType[]>>;
};

export const PlayerDeckContext = createContext<PlayerDeckContextType>({
  playerDeck: [],
  setPlayerDeck: () => {},
});

const STORAGE_KEY = "player_deck";

export const PlayerDeckProvider = ({ children }: { children: ReactNode }) => {
  const [playerDeck, setPlayerDeck] = useState<CardType[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CardType[]) : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(playerDeck));
    } catch {
      // ignore
    }
  }, [playerDeck]);

  const value = useMemo(() => ({ playerDeck, setPlayerDeck }), [playerDeck]);

  return (
    <PlayerDeckContext.Provider value={value}>
      {children}
    </PlayerDeckContext.Provider>
  );
};
