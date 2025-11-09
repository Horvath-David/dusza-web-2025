import {
  ArrowLeft,
  CircleFadingArrowUp,
  HeartPlus,
  Pencil,
  Plus,
  Swords,
  Trash,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldSet } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { API_URL } from "~/constants";
import {
  CardCollectionContext,
  type CardType,
  type ElementsType,
} from "~/context/CardCollectionContext";
import { MasterGeneralContext } from "~/context/MasterGeneralContext";

const CollectionModifier = () => {
  const { collection, setCollection, modifyCard } = useContext(
    CardCollectionContext
  );

  const { worldId } = useContext(MasterGeneralContext);

  const [cardElement, setCardElement] = useState<ElementsType>();
  const [cardName, setCardName] = useState<string>();
  const [cardAttack, setCardAttack] = useState<number>();
  const [cardHealth, setCardHealth] = useState<number>();

  const [isDialogOpen, setIsdialogOpen] = useState<boolean>(false);
  const [isBossCard, setIssBossCard] = useState<boolean>(false);
  const [isModify, setIsModify] = useState<boolean>(false);

  const [doubleDmg, setDoubleDmg] = useState<boolean>();

  const [cardId, setCardId] = useState<number>(0);

  const AddCard = async () => {
    if (!cardElement || !cardName || !cardAttack || !cardHealth) return;

    let attack = cardAttack;
    let health = cardHealth;

    if (isBossCard) {
      if (doubleDmg) {
        attack = attack * 2;
      } else {
        health = health * 2;
      }
    }

    const response = await fetch(API_URL + "/card/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        world_id: worldId,
        cards: [
          {
            name: cardName,
            hp: health,
            attack: attack,
            type: cardElement,
            is_boss: isBossCard,
          },
        ],
      }),
      credentials: "include",
    });

    if (!response.ok) {
      toast.error("Valami nem sikerült");
      return;
    }

    const data = await response.json();

    const card: CardType = {
      id: data.ids[0],
      name: cardName,
      attack: attack,
      hp: health,
      type: cardElement,
      is_boss: isBossCard,
    };

    setCollection([...collection, card]);

    toast.success("Sikeressen létrehoztad a kártyát!");

    setIsdialogOpen(false);
  };

  const setModify = (id: number) => {
    setIsModify(true);

    const card = collection.filter((x) => x.id === id)[0];
    setCardId(id);

    setCardElement(card.type);
    setCardHealth(card.hp);
    setCardAttack(card.attack);
    setCardName(card.name);
    setIsdialogOpen(true);
  };

  const Modify = async () => {
    console.log(cardId);
    if (!cardElement || !cardName || !cardAttack || !cardHealth) return;

    // setCardId(collection[-1].id);

    const card: CardType = {
      id: cardId,
      name: cardName,
      attack: cardAttack,
      hp: cardHealth,
      type: cardElement,
      is_boss: false,
    };

    console.log(card);

    const response = await fetch(API_URL + `/card/${cardId}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(card),
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error);
      return;
    }

    modifyCard(cardId, card);

    toast.success("Sikeressen módosítottad a kártyát!");

    setIsdialogOpen(false);
  };

  const deleteCard = async () => {
    const response = await fetch(API_URL + `/card/${cardId}/delete`, {
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
    setCollection(collection.filter((x) => x.id !== cardId));
    toast.success("Sikeressen kitörölted a kártyát!");

    setIsdialogOpen(false);
  };

  const checkForErrors = () => {
    if (isBossCard) {
      if (doubleDmg === undefined) {
        toast.error("Válasszon egy erősítés fajtát!");
        return true;
      }
    }
    const names = collection.map((x) => x.name);

    if (!cardName) return;
    if (names.includes(cardName)) {
      toast.error("A név már szerepel a kártyák között!");
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (isDialogOpen) return;

    setIssBossCard(false);
    setDoubleDmg(undefined);

    setCardElement(undefined);
    setCardHealth(undefined);
    setCardAttack(undefined);
    setCardName(undefined);
    setIsModify(false);
  }, [isDialogOpen]);

  return (
    <main className="p-5">
      <Link to={"/app/master/game"}>
        <Button className="absolute">
          <ArrowLeft></ArrowLeft>
          Vissza
        </Button>
      </Link>
      <h1 className="font-medium py-2 text-5xl text-center bg-linear-to-b from-black via-black to-neutral-500 dark:from-white via-50% dark:via-white dark:to-neutral-600 bg-clip-text text-transparent">
        Hozd létre a gyűjteményed!
      </h1>
      <section className="flex flex-col items-center mt-7">
        <div className="flex flex-col gap-2">
          <h2 className="font-medium text-xl bg-linear-to-b from-black via-black to-neutral-500 dark:from-white via-50% dark:via-white dark:to-neutral-600 bg-clip-text text-transparent">
            Gyűjteményed
          </h2>
          <div className="w-[50em] h-[30em] border-2 border-white rounded-2xl grid grid-cols-4 p-7 gap-4 overflow-auto">
            {collection.map((e, idx) => {
              return (
                <div
                  className="border-2 border-white rounded-2xl max-h-48 gap-2 p-3 flex flex-col items-center justify-center hover:bg-white hover:text-black transition duration-1000"
                  onClick={() => {
                    setModify(e.id);
                  }}
                >
                  <h2 className="text-lg font-bold">{e.name}</h2>
                  <p className="text-md font-bold">
                    {e.attack}/{e.hp}
                  </p>
                  <p>{e.type}</p>
                  <p>{e.is_boss && "(vezér)"}</p>
                </div>
              );
            })}
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsdialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus></Plus>
                Új hozzáadása
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {isModify ? "Kártya módosítása" : "Új kártya hozzáadása"}
                </DialogTitle>
              </DialogHeader>
              <div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    if (isModify) {
                      Modify();
                    } else {
                      if (checkForErrors()) return;
                      AddCard();
                    }
                  }}
                >
                  <FieldGroup>
                    <FieldSet>
                      <Field>
                        <FieldLabel htmlFor="card-name-input">
                          Kártya neve:
                        </FieldLabel>
                        <Input
                          id="card-name-input"
                          maxLength={16}
                          required
                          value={cardName}
                          onChange={(e) => {
                            setCardName(e.target.value);
                          }}
                        ></Input>
                      </Field>
                      {isBossCard ? (
                        <div className="flex min-w-max gap-3 justify-between">
                          <Button
                            type="button"
                            className="flex-1"
                            onClick={() => {
                              setDoubleDmg(false);
                            }}
                            variant={
                              doubleDmg === true ? "secondary" : "default"
                            }
                          >
                            <HeartPlus></HeartPlus>
                            Életerő duplázása
                          </Button>
                          <Button
                            type="button"
                            className="flex-1"
                            onClick={() => {
                              setDoubleDmg(true);
                            }}
                            variant={
                              doubleDmg === false && doubleDmg !== undefined
                                ? "secondary"
                                : "default"
                            }
                          >
                            <Swords></Swords>
                            Sebzés duplázása
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Field>
                            <FieldLabel htmlFor="card-attack-input">
                              Kártya sebzése:
                            </FieldLabel>
                            <Input
                              id="card-attack-input"
                              min={1}
                              type="number"
                              value={cardAttack}
                              onChange={(e) => {
                                setCardAttack(parseInt(e.target.value));
                              }}
                              required
                            ></Input>
                          </Field>
                          <Field>
                            <FieldLabel htmlFor="card-health-input">
                              Kártya életereje:
                            </FieldLabel>
                            <Input
                              id="card-health-input"
                              min={1}
                              type="number"
                              value={cardHealth}
                              onChange={(e) => {
                                setCardHealth(parseInt(e.target.value));
                              }}
                              required
                            ></Input>
                          </Field>
                          <Field>
                            <FieldLabel>Kártya eleme:</FieldLabel>
                            <Select
                              value={cardElement}
                              onValueChange={(e) => {
                                setCardElement(e as ElementsType);
                              }}
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Válassz egy elemet"></SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Elemek</SelectLabel>
                                  <SelectItem value="fire">Tűz</SelectItem>
                                  <SelectItem value="water">Víz</SelectItem>
                                  <SelectItem value="earth">Föld</SelectItem>
                                  <SelectItem value="air">Szél</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </Field>
                        </>
                      )}
                      <Field>
                        {isModify && !isBossCard ? (
                          <div className="flex gap-3">
                            <Button type="submit">
                              <Pencil></Pencil>Módosítás
                            </Button>
                            <Button
                              variant={"secondary"}
                              type="button"
                              onClick={() => {
                                setIssBossCard(true);
                                setIsModify(false);
                              }}
                            >
                              <CircleFadingArrowUp></CircleFadingArrowUp>
                              Vezér készítés
                            </Button>
                            <Button
                              variant={"destructive"}
                              type="button"
                              onClick={deleteCard}
                            >
                              <Trash></Trash>
                              Törlés
                            </Button>
                          </div>
                        ) : (
                          <Button type="submit">
                            <Plus></Plus>
                            Létrehozzás
                          </Button>
                        )}
                      </Field>
                    </FieldSet>
                  </FieldGroup>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </main>
  );
};

export default CollectionModifier;
