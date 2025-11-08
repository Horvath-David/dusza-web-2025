import { ArrowLeft, Pencil, Plus, Trash } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
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
import {
  CardCollectionContext,
  type CardType,
  type ElementsType,
} from "~/context/CardCollectionContext";

const CollectionModifier = () => {
  const { collection, setCollection, modifyCard } = useContext(
    CardCollectionContext
  );

  const [cardElement, setCardElement] = useState<ElementsType>();
  const [cardName, setCardName] = useState<string>();
  const [cardAttack, setCardAttack] = useState<number>();
  const [cardHealth, setCardHealth] = useState<number>();

  const [isDialogOpen, setIsdialogOpen] = useState<boolean>(false);
  const [isModify, setIsModify] = useState<boolean>(false);

  const [cardId, setCardId] = useState<number>(0);

  const AddCard = () => {
    if (!cardElement || !cardName || !cardAttack || !cardHealth) return;
    const card: CardType = {
      id:
        collection[collection.length - 1] !== undefined
          ? collection[collection.length - 1].id + 1
          : 0,
      name: cardName,
      attack: cardAttack,
      health: cardHealth,
      type: cardElement,
      isBoss: false,
    };

    console.log(collection[1]);

    setCollection([...collection, card]);

    setIsdialogOpen(false);
  };

  const setModify = (id: number) => {
    setIsModify(true);

    const card = collection[id];
    setCardId(id);

    setCardElement(card.type);
    setCardHealth(card.health);
    setCardAttack(card.attack);
    setCardName(card.name);
    setIsdialogOpen(true);
  };

  const Modify = () => {
    console.log(cardId);
    if (!cardElement || !cardName || !cardAttack || !cardHealth) return;

    // setCardId(collection[-1].id);

    const card: CardType = {
      id: cardId,
      name: cardName,
      attack: cardAttack,
      health: cardHealth,
      type: cardElement,
      isBoss: false,
    };

    console.log(card);

    modifyCard(cardId, card);

    console.log("jo");
    setIsdialogOpen(false);
  };

  const deleteCard = () => {
    setCollection(collection.filter((x) => x.id !== cardId));
    setIsdialogOpen(false);
  };

  useEffect(() => {
    if (isDialogOpen) return;

    setCardElement(undefined);
    setCardHealth(undefined);
    setCardAttack(undefined);
    setCardName(undefined);
    setIsModify(false);
  }, [isDialogOpen]);

  return (
    <main className="p-5">
      <Link to={"/master"}>
        <Button className="absolute">
          <ArrowLeft></ArrowLeft>
          Vissza
        </Button>
      </Link>
      <h1 className="text-5xl font-bold text-center">
        Hozd létre a gyűjteményed!
      </h1>
      <section className="flex flex-col items-center mt-7">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl">Gyűjteményed</h2>
          <div className="w-[50em] h-[30em] border-2 border-white rounded-2xl grid grid-cols-4 p-7 gap-4 overflow-auto">
            {collection.map((e, idx) => {
              return (
                <div
                  className="border-2 border-white rounded-2xl max-h-48 gap-2 p-3 flex flex-col items-center justify-center"
                  onClick={() => {
                    setModify(e.id);
                  }}
                >
                  <h2 className="text-lg font-bold">{e.name}</h2>
                  <p className="text-md font-bold">
                    {e.attack}/{e.health}
                  </p>
                  <p>{e.type}</p>
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
                              <SelectItem value="wind">Szél</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field>
                        {isModify ? (
                          <div className="flex gap-3">
                            <Button type="submit">
                              <Pencil></Pencil>Módosítás
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
                          <Button type="submit">Létrehozzás</Button>
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
