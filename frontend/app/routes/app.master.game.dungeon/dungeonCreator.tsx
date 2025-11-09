import { SelectValue } from "@radix-ui/react-select";
import { ArrowLeft, Pencil, Plus, Trash, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldSet } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "~/components/ui/item";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { API_URL } from "~/constants";
import {
  CardCollectionContext,
  type CardType,
} from "~/context/CardCollectionContext";
import {
  DungeonContext,
  type DungeonType,
  type DungeonTypeType,
} from "~/context/DungeonContext";
import { MasterGeneralContext } from "~/context/MasterGeneralContext";
import { useGetAllInfo } from "~/helpers";
import { CardCard } from "../app.player.game.$id/card-card";

const DungeonCreator = () => {
  const getAllInfo = useGetAllInfo();
  const { dungeons, setDungeons } = useContext(DungeonContext);
  const { collection } = useContext(CardCollectionContext);
  const { worldId } = useContext(MasterGeneralContext);

  const [dungeoName, setDungeoName] = useState<string>();
  const [dungeonType, setDungeonType] = useState<DungeonTypeType>();

  const [isCardSelect, setIsCardSelect] = useState<boolean>(false);
  const [isModifying, setIsModifying] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [dungeonCollection, setDungeonCollection] = useState<CardType[]>([]);

  const [dunId, setDunId] = useState<number>(0);

  const AddCardToDungeon = (id: number) => {
    setDungeonCollection((prev) => [
      ...prev,
      ...collection.filter((e) => e.id === id),
    ]);
    setIsCardSelect(false);
  };

  useEffect(() => {
    console.log(dungeons);
  }, []);

  const AddDungeon = async () => {
    if (!dungeoName || !dungeonType) return;

    toast("jo");

    const cards: number[] = [];
    dungeonCollection.forEach((element) => {
      cards.push(element.id);
    });

    const response = await fetch(API_URL + "/dungeon/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: dungeoName,
        type: dungeonType,
        cards: cards,
        world_id: worldId,
      }),
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error);
      return;
    }

    const dungeon: DungeonType = {
      id: 0,
      name: dungeoName,
      type: dungeonType,
      cards: cards,
      world_id: worldId,
    };

    setDungeons([...dungeons, dungeon]);
    setIsDialogOpen(false);
    await getAllInfo(worldId);
    toast.success("Sikeres kazamata létrehozzás");
  };

  const HandleDelete = (id: number) => {
    setDungeonCollection((prev) => prev.filter((x) => x.id !== id));
  };

  const HandleDeleteDungeon = async (id: number) => {
    const response = await fetch(API_URL + `/dungeon/${id}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error);
      return;
    }
    setDungeons(dungeons.filter((x) => x.id !== id));
    await getAllInfo(worldId);
    toast.success("Sikeres kazamata törlés");
  };

  const HandleOnModify = (id: number) => {
    setIsModifying(true);

    const dungeon = dungeons.filter((e) => e.id === id)[0];
    setDungeoName(dungeon.name);
    setDungeonType(dungeon.type);

    dungeon.cards.forEach((element) => {
      setDungeonCollection((prev) => [
        ...prev,
        collection.filter((e) => e.id === element)[0],
      ]);
    });
    setDunId(id);
    setIsDialogOpen(true);
  };

  const ChangeDungeon = async () => {
    if (!dungeoName || !dungeonType) return;

    const cards: number[] = [];
    dungeonCollection.forEach((element) => {
      cards.push(element.id);
    });

    const dungeon: DungeonType = {
      id: dunId,
      name: dungeoName,
      type: dungeonType,
      cards: cards,
      world_id: worldId,
    };

    const response = await fetch(API_URL + `/dungeon/${dunId}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dungeon),
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error);
      return;
    }
    const newDun = dungeons.map((x) => (x.id === dunId ? dungeon : x));
    setDungeons(newDun);
    setIsModifying(false);
    await getAllInfo(worldId);
    toast.success("Sikeres módosítás");
    setIsDialogOpen(false);
  };

  const BigCheck = () => {
    if (dungeonType === undefined) return true;
    if (dungeonType === "basic") {
      if (dungeonCollection.length < 1) return true;
    } else if (dungeonType === "small") {
      if (dungeonCollection.length < 4) return true;
    } else if (dungeonCollection.length < 6) return true;
    return false;
  };

  const bigCheckBob = () => {
    if (dungeonType === undefined) return false;
    if (dungeonType === "basic") {
      if (dungeonCollection.length !== 1) return false;
    }
    if (dungeonType === "small") {
      if (dungeonCollection.length !== 4) return false;
    }
    if (dungeonType === "big") {
      if (dungeonCollection.length !== 6) return false;
    }

    return true;
  };

  const lilCheck = () => {
    if (dungeonCollection.length === 3 && dungeonType === "small") {
      return true;
    }
    if (dungeonCollection.length === 5 && dungeonType === "big") {
      return true;
    }
    return false;
  };

  useEffect(() => {
    setIsCardSelect(false);
    if (isDialogOpen) return;
    setIsModifying(false);
    setDungeoName(undefined);
    setDungeonType(undefined);
    setDungeonCollection([]);
  }, [isDialogOpen]);

  return (
    <main className="p-5">
      <Link to={"/app/master/game"}>
        <Button className="absolute top-[90%] left-[1%]" variant={"outline"}>
          <ArrowLeft></ArrowLeft>
          Vissza
        </Button>
      </Link>
      <h1 className="font-medium text-5xl text-center bg-linear-to-b from-black via-black to-neutral-500 dark:from-white via-50% dark:via-white dark:to-neutral-600 bg-clip-text text-transparent">
        Kazamaták
      </h1>
      <section className="max-w-[50%] m-auto mt-10 flex flex-col gap-8">
        <ScrollArea className=" max-h-[25em]  border-2 border-gray-500 rounded-2xl p-2 overflow-auto">
          {dungeons.length > 0 ? (
            dungeons.map((e) => {
              return (
                <div>
                  <Item>
                    <ItemContent>
                      <ItemTitle>{e.name}</ItemTitle>
                      <ItemDescription>
                        {e.type === "basic"
                          ? "Egyszerű találkozás"
                          : e.type === "small"
                            ? "Kis kazamata"
                            : "Nagy kazamata"}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Button
                        onClick={() => {
                          HandleOnModify(e.id);
                        }}
                      >
                        <Pencil></Pencil>
                      </Button>
                      <Button
                        variant={"destructive"}
                        onClick={() => {
                          HandleDeleteDungeon(e.id);
                        }}
                      >
                        <Trash></Trash>
                      </Button>
                    </ItemActions>
                  </Item>
                  <Separator></Separator>
                </div>
              );
            })
          ) : (
            <h2>Még nincs létrehozott kazamatád</h2>
          )}
        </ScrollArea>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <Button className="w-full">
              <Plus></Plus>
              Új kazamata létrehozzása
            </Button>
          </DialogTrigger>
          <DialogContent className="min-w-[60%] min-h-[60%]">
            <DialogTitle className="text-2xl font-bold ">
              {isCardSelect
                ? "Gyűjteményed"
                : `Kazamata ${isModifying ? "módosítása" : "létrehozzása"}`}
            </DialogTitle>
            {isCardSelect ? (
              <div className="justify-between flex flex-col">
                {collection.filter(
                  (x) =>
                    !dungeonCollection.includes(x) &&
                    (lilCheck() ? x.is_boss : !x.is_boss)
                ).length < 1 ? (
                  <h1 className="text-xl">
                    Nincs elég kártya a gyűjteményedben!
                  </h1>
                ) : (
                  <section className="grid grid-cols-5 gap-3 overflow-auto">
                    {collection
                      .filter(
                        (x) =>
                          !dungeonCollection.includes(x) &&
                          (lilCheck() ? x.is_boss : !x.is_boss)
                      )
                      .map((e) => {
                        return (
                          <div className="items-center flex flex-col gap-2">
                            <CardCard
                              card={e}
                              onClick={() => {
                                AddCardToDungeon(e.id);
                              }}
                            ></CardCard>
                          </div>
                        );
                      })}
                  </section>
                )}
                <Button
                  onClick={() => {
                    setIsCardSelect(false);
                  }}
                >
                  <ArrowLeft></ArrowLeft>
                  Vissza
                </Button>
              </div>
            ) : (
              <section>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!bigCheckBob()) {
                      toast.error("Nem megfelelőek a kártyák!");
                      return;
                    }
                    if (isModifying) {
                      ChangeDungeon();
                    } else {
                      AddDungeon();
                    }
                  }}
                >
                  <FieldGroup>
                    <FieldSet>
                      <Field>
                        <FieldLabel htmlFor="dungeon-name">
                          Kazamata neve:
                        </FieldLabel>
                        <Input
                          required
                          id="dungeon-name"
                          value={dungeoName}
                          onChange={(e) => {
                            setDungeoName(e.target.value);
                          }}
                        ></Input>
                      </Field>
                      <Field>
                        <Select
                          value={dungeonType}
                          onValueChange={(e) =>
                            setDungeonType(e as DungeonTypeType)
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Válassz egy típust"></SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">
                              Egyszerű találkozás
                            </SelectItem>
                            <SelectItem value="small">Kis kazamata</SelectItem>
                            <SelectItem value="big">Nagy kazamata</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                      <div className="grid grid-cols-6 gap-2">
                        {dungeonCollection.map((e) => {
                          return (
                            <div className=" relative rounded-2xl items-center flex flex-col gap-2  justify-center ">
                              <button
                                type="button"
                                onClick={() => HandleDelete(e.id)}
                                className="absolute top-[-0.5em] right-[-0.5em] bg-black text-white rounded-full p-1 hover:bg-red-600 transition"
                              >
                                <X size={16} />
                              </button>

                              <CardCard card={e}></CardCard>
                            </div>
                          );
                        })}
                        {BigCheck() ? (
                          <div
                            className="border-2 border-white rounded-2xl flex justify-center h-full min-h-48 items-center hover:bg-white hover:text-black"
                            onClick={() => {
                              setIsCardSelect(true);
                            }}
                          >
                            <Plus></Plus>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                      <Field>
                        {isModifying ? (
                          <Button>
                            <Pencil></Pencil>
                            Módosítás
                          </Button>
                        ) : (
                          <Button>
                            <Plus></Plus>
                            Létrehozzás
                          </Button>
                        )}
                      </Field>
                    </FieldSet>
                  </FieldGroup>
                </form>
              </section>
            )}
          </DialogContent>
        </Dialog>
      </section>
    </main>
  );
};

export default DungeonCreator;
