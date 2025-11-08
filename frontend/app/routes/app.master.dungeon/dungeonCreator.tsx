import { SelectValue } from "@radix-ui/react-select";
import { ArrowLeft, Pencil, Plus, Trash, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
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
import {
  CardCollectionContext,
  type CardType,
} from "~/context/CardCollectionContext";
import { DungeonContext, type DungeonTypeType } from "~/context/DungeonContext";

const DungeonCreator = () => {
  const { dungeons, setDungeons } = useContext(DungeonContext);
  const { collection } = useContext(CardCollectionContext);

  const [dungeoName, setDungeoName] = useState<string>();
  const [dungeonType, setDungeonType] = useState<DungeonTypeType>();

  const [isCardSelect, setIsCardSelect] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [dungeonCollection, setDungeonCollection] = useState<CardType[]>([]);

  const AddCardToDungeon = (id: number) => {
    setDungeonCollection((prev) => [...prev, collection[id]]);
    setIsCardSelect(false);
  };

  const HandleDelete = (id: number) => {
    setDungeonCollection((prev) => prev.filter((x) => x.id !== id));
  };

  useEffect(() => {
    setIsCardSelect(false);
  }, [isDialogOpen]);

  return (
    <main className="p-5">
      <Link to={"/app/master"}>
        <Button className="absolute">
          <ArrowLeft></ArrowLeft>
          Vissza
        </Button>
      </Link>
      <h1 className="text-5xl font-bold text-center">Kazamaták</h1>
      <section className="max-w-[50%] m-auto mt-10 flex flex-col gap-8">
        <ScrollArea className=" max-h-[25em]  border-2 border-gray-500 rounded-2xl p-2 overflow-auto">
          <Item>
            <ItemContent>
              <ItemTitle>Kazamata neve</ItemTitle>
              <ItemDescription>kazamata fajtája</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button>
                <Pencil></Pencil>
              </Button>
              <Button variant={"destructive"}>
                <Trash></Trash>
              </Button>
            </ItemActions>
          </Item>
        </ScrollArea>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <Button className="w-full">
              <Plus></Plus>
              Új kazamta létrehozzása
            </Button>
          </DialogTrigger>
          <DialogContent className="min-w-[60%] min-h-[60%]">
            <DialogTitle className="text-2xl font-bold ">
              {isCardSelect ? "Gyűjteményed" : "Kazamata létrehozzása"}
            </DialogTitle>
            {isCardSelect ? (
              <div className="justify-between flex flex-col">
                {collection.filter((x) => !dungeonCollection.includes(x))
                  .length < 1 ? (
                  <h1 className="text-xl">
                    Nincs elég kártya a gyűjteményedben!
                  </h1>
                ) : (
                  <section className="grid grid-cols-4 gap-3">
                    {collection
                      .filter((x) => !dungeonCollection.includes(x))
                      .map((e) => {
                        return (
                          <div
                            className="border-2 border-white rounded-2xl items-center flex flex-col gap-2 p-2 bg-white text-black"
                            onClick={() => {
                              AddCardToDungeon(e.id);
                            }}
                          >
                            <h2 className="text-lg font-bold">{e.name}</h2>
                            <p>
                              {e.attack}/{e.health}
                            </p>
                            <p>{e.type}</p>
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
                <form>
                  <FieldGroup>
                    <FieldSet>
                      <Field>
                        <FieldLabel htmlFor="dungeon-name">
                          Kazamata neve:
                        </FieldLabel>
                        <Input
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
                            <div className=" relative border-2 border-white rounded-2xl items-center flex flex-col gap-2 p-3 justify-center bg-white text-black">
                              <button
                                type="button"
                                onClick={() => HandleDelete(e.id)}
                                className="absolute top-[-0.5em] right-[-0.5em] bg-black text-white rounded-full p-1 hover:bg-red-600 transition"
                              >
                                <X size={16} />
                              </button>

                              <h2 className="text-md font-bold">{e.name}</h2>
                            </div>
                          );
                        })}
                        {dungeonCollection.length < 6 ? (
                          <div
                            className="border-2 border-white rounded-2xl flex justify-center h-20 items-center hover:bg-white hover:text-black"
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
                        <Button>
                          <Plus></Plus>
                          Létrehozzás
                        </Button>
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
