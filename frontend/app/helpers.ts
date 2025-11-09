import { API_URL } from "~/constants";
import { toast } from "sonner";
import { useContext, useCallback } from "react";
import { CardCollectionContext } from "~/context/CardCollectionContext";
import { DungeonContext } from "~/context/DungeonContext";

// Use in components: const getAllInfo = useGetAllInfo();
export const useGetAllInfo = () => {
  const { setCollection } = useContext(CardCollectionContext);
  const { setDungeons } = useContext(DungeonContext);

  const getAllInfo = useCallback(async (id: number) => {
    const response = await fetch(API_URL + `/world/${id}/cards`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      toast.error(data.error);
      return;
    }
    setCollection(data.cards);

    const response2 = await fetch(
      API_URL + `/world/${id}/dungeons?card_ids_only=true`,
      { method: "GET", credentials: "include" }
    );
    const data2 = await response2.json();
    if (!response2.ok) {
      toast.error(data2.error);
      return;
    }
    setDungeons(data2.dungeons);
  }, [setCollection, setDungeons]);

  return getAllInfo;
};