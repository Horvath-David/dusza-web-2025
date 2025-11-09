import { ArrowLeft, Plus, X } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";
import { API_URL } from "~/constants";
import {
  CardCollectionContext,
  type CardType,
} from "~/context/CardCollectionContext";
import { MasterGeneralContext } from "~/context/MasterGeneralContext";
import { PlayerDeckContext } from "~/context/playerCardContext";

const PlayerDeck = () => {
  const { collection } = useContext(CardCollectionContext);
  // const [playerDeck, setPlayerDeck] = useState<CardType[]>([]);
  const { playerDeck, setPlayerDeck } = useContext(PlayerDeckContext);

  const { worldId } = useContext(MasterGeneralContext);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const AddCardToPlayer = async (id: number) => {
    const newDeck = [...playerDeck, collection.find((e) => e.id === id)!];

    setPlayerDeck(newDeck);

    setIsDialogOpen(false);
    console.log(newDeck.map((e) => e.id));

    const response = await fetch(`${API_URL}/world/${worldId}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        player_cards: newDeck.map((e) => e.id),
      }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error);
      return;
    }

    toast.success("Sikeres hozzáadás");
  };

  const HandleDelete = async (id: number) => {
    const newDeck = playerDeck.filter((e) => e.id !== id);
    setPlayerDeck(newDeck);

    const response = await fetch(`${API_URL}/world/${worldId}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        player_cards: newDeck.map((e) => e.id),
      }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error);
      return;
    }

    toast.success("Sikeres törlés");
  };

  return (
    <main className="flex flex-col items-center justify-center p-10 gap-2">
      <Link to={"/app/master/game"}>
        <Button className="absolute top-[10%] left-[1%]" variant={"outline"}>
          <ArrowLeft></ArrowLeft>
          Vissza
        </Button>
      </Link>
      <h1 className="font-medium py-2 text-5xl text-center bg-linear-to-b from-black via-black to-neutral-500 dark:from-white via-50% dark:via-white dark:to-neutral-600 bg-clip-text text-transparent">
        Játékos gyűjteménye
      </h1>

      <section className="w-[50em] h-[30em] border-2 border-gray-400 rounded-2xl grid grid-cols-5 p-6 gap-3">
        {playerDeck.map((e) => {
          return (
            <div className="relative h-[12em] border-2 border-white rounded-2xl items-center flex flex-col gap-2 p-3 justify-center bg-white text-black">
              <button
                type="button"
                onClick={() => HandleDelete(e.id)}
                className="absolute top-[-0.5em] right-[-0.5em] bg-black text-white rounded-full p-1 hover:bg-red-600 transition"
              >
                <X size={16} />
              </button>

              <h2 className="text-md font-bold">{e.name}</h2>
              <p>
                {e.attack}/{e.hp}
              </p>
              <p>{e.type}</p>
              <p>{e.is_boss && "(vezér)"}</p>
            </div>
          );
        })}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger className="h-fit">
            <div
              className="border-2 border-white h-[12em] rounded-2xl flex justify-center transition duration-1000 items-center hover:bg-white hover:text-black"
              onClick={() => {
                // setIsCardSelect(true);
              }}
            >
              <Plus></Plus>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="text-2xl font-bold">
              Gyűjteményed
            </DialogHeader>

            {collection.filter((n) => !playerDeck.includes(n) && !n.is_boss)
              .length < 1 ? (
              <h3>Nincs több kártyád a gyűjteményedben</h3>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {collection
                  .filter((n) => !playerDeck.includes(n) && !n.is_boss)
                  .map((e) => {
                    return (
                      <div
                        className="border-2 border-white rounded-2xl items-center flex flex-col gap-2 p-2 bg-white text-black"
                        onClick={() => {
                          AddCardToPlayer(e.id);
                        }}
                      >
                        <h2 className="text-lg font-bold">{e.name}</h2>
                        <p>
                          {e.attack}/{e.hp}
                        </p>
                        <p>{e.type}</p>
                        <p>{e.is_boss && "(vezér)"}</p>
                      </div>
                    );
                  })}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </section>
    </main>
  );
};

export default PlayerDeck;
