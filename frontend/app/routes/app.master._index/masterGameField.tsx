import { FileStack, Pencil, Plus, Swords, Trash } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Field, FieldLabel, FieldSet } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
} from "~/components/ui/item";
import { Separator } from "~/components/ui/separator";
import { API_URL } from "~/constants";
import {
  CardCollectionContext,
  type CardType,
} from "~/context/CardCollectionContext";
import { DungeonContext } from "~/context/DungeonContext";
import { MasterGeneralContext } from "~/context/MasterGeneralContext";
import { PlayerDeckContext } from "~/context/playerCardContext";

type WorldType = {
  id: number;
  name: string;
  cards: number;
  dungeons: number;
};

const MasterGameField = () => {
  const navi = useNavigate();

  const [gameName, setGameName] = useState<string>();

  const { worldId, setWorldId } = useContext(MasterGeneralContext);
  const { playerDeck, setPlayerDeck } = useContext(PlayerDeckContext);

  const { collection, setCollection } = useContext(CardCollectionContext);

  const { setDungeons } = useContext(DungeonContext);

  const [allWorld, setAllWorld] = useState<WorldType[]>([]);

  useEffect(() => {
    getWorlds();
  }, []);

  const getWorlds = async () => {
    const response = await fetch(API_URL + "/world/my", {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    data.worlds.forEach((element: WorldType) => {
      setAllWorld((prev) => [...prev, element]);
    });
  };

  const OnModifyDungeon = async (id: number) => {
    setWorldId(id);

    getAllInfo(id);

    localStorage.clear();

    navi("game");
  };

  const getAllInfo = async (id: number) => {
    const vami = await parseInt(localStorage.getItem("world_id")!);

    // if (vami < 0) setWorldId(-1);

    const response = await fetch(API_URL + `/world/${id}/cards`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error);
      return;
    }

    setCollection((prev) => [...prev, ...data.cards]);

    const response2 = await fetch(
      API_URL + `/world/${id}/dungeons?card_ids_only=true`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data2 = await response2.json();

    if (!response2.ok) {
      toast.error(data2.error);
      return;
    }
    console.log("vami");

    setDungeons((prev) => [...prev, ...data2.dungeons]);

    const response3 = await fetch(API_URL + `/world/${id}`, {
      method: "GET",
      credentials: "include",
    });

    const data3 = await response3.json();

    if (!response3.ok) {
      toast.error(data3.error);
      return;
    }
    console.log(data3.world.player_cards);

    setPlayerDeck(
      collection.filter((x) => data3.world.player_cards.include(x.id))
    );

    // setDungeons((prev) => [...prev, ...data3.dungeons]);
  };

  const OnWorldDelete = async (id: number) => {
    const response = await fetch(API_URL + `/world/${id}/delete`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      toast.error("Valami nem sikerült");
      return;
    }

    setAllWorld(allWorld.filter((e) => e.id !== id));
    toast.success("Sikeres törlés");
    return;
  };

  const OnSubmits = async () => {
    const response = await fetch(API_URL + "/world/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: gameName,
      }),
      credentials: "include",
    });

    if (!response.ok) {
      toast.error("Valami nem sikerült");
      return;
    }

    const data = await response.json();

    console.log(data);
    setWorldId(parseInt(data.id));
    navi("game");
  };

  return (
    <main className="flex flex-col items-center">
      <h1 className="font-medium mt-8 py-2 text-3xl text-center bg-linear-to-b from-black via-black to-neutral-500 dark:from-white via-50% dark:via-white dark:to-neutral-600 bg-clip-text text-transparent">
        Üdvözlünk a játékaid között
      </h1>

      <section className="justify-center">
        <h1 className="font-medium mt-8 py-2 text-xl bg-linear-to-b from-black via-black to-neutral-500 dark:from-white via-50% dark:via-white dark:to-neutral-600 bg-clip-text text-transparent">
          Játékaid
        </h1>
        <div className="border-2 border-gray-500 rounded-2xl min-w-[50em] h-[20em] overflow-auto">
          {allWorld.map((e) => {
            return (
              <>
                <Item>
                  <ItemContent>
                    <ItemHeader className="font-bold text-xl">
                      {e.name}
                    </ItemHeader>
                    <ItemDescription className="flex gap-2">
                      <span className="flex justify-center gap-1">
                        {e.dungeons}
                        <Swords></Swords>
                      </span>
                      <span className="flex justify-center gap-1">
                        {e.cards}
                        <FileStack></FileStack>
                      </span>
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button
                      onClick={() => {
                        OnModifyDungeon(e.id);
                      }}
                    >
                      <Pencil></Pencil>
                    </Button>
                    <Button
                      variant={"destructive"}
                      onClick={() => {
                        OnWorldDelete(e.id);
                      }}
                    >
                      <Trash></Trash>
                    </Button>
                  </ItemActions>
                </Item>
                <Separator></Separator>
              </>
            );
          })}
        </div>
      </section>

      <section className="mt-9">
        <Dialog>
          <DialogTrigger>
            <Button>
              <Plus></Plus>Új játék létrehozzás
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>Új játék</DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                OnSubmits();
              }}
              className="space-y-6"
            >
              <FieldSet>
                <Field>
                  <FieldLabel>Játék neve: </FieldLabel>
                  <Input
                    type="text"
                    required
                    value={gameName}
                    onChange={(e) => {
                      setGameName(e.target.value);
                    }}
                  ></Input>
                </Field>
              </FieldSet>
              <Button type="submit">
                <Plus></Plus>Új játék létrehozzás
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </section>
    </main>
  );
};

export default MasterGameField;
