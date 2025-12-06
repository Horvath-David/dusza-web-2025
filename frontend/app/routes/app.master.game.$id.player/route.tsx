import { ArrowLeft, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams, useRevalidator } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { CardContent, Card as ShadcnCard } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";
import { API_URL } from "~/constants";
import type { Card, DungeonIdOnly, World } from "~/models";
import { CardCard } from "../app.player.game.$id/card-card";
import type { Route } from "./+types/route";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const res = await fetch(`${API_URL}/world/${params.id}/cards`, {
    method: "GET",
    credentials: "include",
  });
  const cards = (await res.json()).cards as Card[];

  const dungeonsRes = await fetch(
    `${API_URL}/world/${params.id}/dungeons?card_ids_only=true`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  const dungeons = (await dungeonsRes.json()).dungeons as DungeonIdOnly[];

  const worldRes = await fetch(`${API_URL}/world/${params.id}`, {
    method: "GET",
    credentials: "include",
  });
  const world = (await worldRes.json()).world as World;

  console.log(world);

  return { cards, dungeons, world };
}

export default function PlayerDeck({ loaderData }: Route.ComponentProps) {
  const { cards: collection, world } = loaderData;
  const { player_cards: playerDeck } = world;
  const revalidator = useRevalidator();

  // const [playerDeck, setPlayerDeck] = useState<CardType[]>([]);

  const { id: worldId } = useParams();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    console.log(playerDeck);
    console.log(
      collection.filter(
        (n) => !playerDeck.some((c) => c.id === n.id) && !n.is_boss
      )
    );
  }, []);

  const AddCardToPlayer = async (id: number) => {
    const newDeck = [...playerDeck, collection.find((e) => e.id === id)!];

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

    await revalidator.revalidate();

    setIsDialogOpen(false);

    toast.success("Sikeres hozzáadás");
  };

  const HandleDelete = async (id: number) => {
    const newDeck = playerDeck.filter((e) => e.id !== id);

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

    await revalidator.revalidate();

    toast.success("Sikeres törlés");
  };

  return (
    <main className="flex flex-col items-center justify-center p-10 gap-2">
      <Link to={`/app/master/game/${worldId}`}>
        <Button className="absolute top-[90%] left-[1%]" variant={"outline"}>
          <ArrowLeft></ArrowLeft>
          Vissza
        </Button>
      </Link>
      <h1 className="font-medium py-2 text-5xl text-center bg-linear-to-b from-black via-black to-neutral-500 dark:from-white via-50% dark:via-white dark:to-neutral-600 bg-clip-text text-transparent">
        Játékos gyűjteménye
      </h1>

      <ShadcnCard className="w-[60em] h-[65vh] rounded-2xl p-6">
        <CardContent className="grid grid-cols-5 gap-4 p-0">
          {playerDeck.map((e) => {
            return (
              <div className="relative h-[12em] items-center flex flex-col gap-2  justify-center">
                <button
                  type="button"
                  onClick={() => HandleDelete(e.id)}
                  className="absolute top-[-0.5em] right-[-0.5em] bg-black text-white rounded-full p-1 hover:bg-red-600 transition"
                >
                  <X size={16} />
                </button>

                <CardCard card={e}></CardCard>

                {/* <h2 className="text-md font-bold">{e.name}</h2>
              <p>
                {e.attack}/{e.hp}
              </p>
              <p>{e.type}</p>
              <p>{e.is_boss && "(vezér)"}</p> */}
              </div>
            );
          })}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger className="h-fit">
              <div
                className="border-2 border-white h-[12em]  rounded-2xl flex justify-center transition duration-1000 items-center hover:bg-white hover:text-black"
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

              {collection.filter(
                (n) => !playerDeck.some((c) => c.id === n.id) && !n.is_boss
              ).length < 1 ? (
                <h3>Nincs több kártyád a gyűjteményedben</h3>
              ) : (
                <div className="grid grid-cols-3 gap-3 overflow-auto">
                  {collection
                    .filter(
                      (n) =>
                        !playerDeck.some((c) => c.id === n.id) && !n.is_boss
                    )
                    .map((e) => {
                      return (
                        <div className=" items-center flex flex-col gap-2">
                          <CardCard
                            card={e}
                            onClick={() => {
                              AddCardToPlayer(e.id);
                            }}
                          ></CardCard>
                          {/* <h2 className="text-lg font-bold">{e.name}</h2>
                        <p>
                          {e.attack}/{e.hp}
                        </p>
                        <p>{e.type}</p>
                        <p>{e.is_boss && "(vezér)"}</p> */}
                        </div>
                      );
                    })}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
      </ShadcnCard>
    </main>
  );
}
