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
}

export interface Card {
  id: number;
  name: string;
  hp: number;
  attack: number;
  type: string;
  is_boss: boolean;
}
