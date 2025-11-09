export interface UserMe {
  id: number;
  username: string;
  display_name: string;
}

export interface World {
  id: number;
  name: string;
  owner: string;
  is_playable: boolean;
  is_public: boolean;
  dungeons: number;
  cards: number;
  player_cards: Card[];
}

export interface Card {
  id: number;
  name: string;
  hp: number;
  attack: number;
  type: string;
  is_boss: boolean;
}

export interface Dungeon {
  id: number;
  name: string;
  type: string;
  cards: Card[];
}

export interface GameStateResponse {
  id: number;
  world: {
    id: number;
    name: string;
    owner: string;
  };
  state: GameState;
  created_at: string;
  last_updated_at: string;
}

export interface GameState {
  name: string;
  cards: Card[];
  dungeons: Dungeon[];
  playerCards: Card[];
  playerDeck: Card[];
  phase: string;
  phaseData: any;
}
