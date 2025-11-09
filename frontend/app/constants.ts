export const API_URL = import.meta.env.VITE_API_URL;

export const TYPE_MAP: { [key: string]: string } = {
  fire: "Tűz",
  water: "Víz",
  earth: "Föld",
  air: "Levegő",
};

export const DUNGEON_TYPES: { [key: string]: string } = {
  basic: "Egyszerű talalálkozás",
  small: "Kis kazamata",
  big: "Nagy kazamata",
};
