import { useState } from "react";
import { API_URL, DUNGEON_TYPES } from "~/constants";
import type { Card, GameStateResponse } from "~/models";
import type { Route } from "./+types/route";
import { CardCard } from "./card-card";
import { Button } from "~/components/ui/button";
import {
  AlertTriangle,
  ArrowLeft,
  Castle,
  FileStack,
  Swords,
} from "lucide-react";
import {
  Card as ShadcnCard,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const res = await fetch(`${API_URL}/state/${params.id}`, {
    method: "GET",
    credentials: "include",
  });
  const game = (await res.json()).game_state as GameStateResponse;

  return { game };
}

export default function PlayerGame({ loaderData }: Route.ComponentProps) {
  const [game, setGame] = useState<GameStateResponse>(loaderData.game);

  const activeDungeon = game.state.dungeons.find(
    (x) => x.id === game.state.phaseData?.dungeonId
  );

  if (!loaderData.game) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        Nem található a játék
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl w-full h-full mx-auto flex flex-col gap-4">
      {(game.state.phase === "overview" || game.state.phase === "deck") && (
        <>
          <h1 className="font-medium mt-8 py-2 text-3xl bg-linear-to-b from-black via-black to-neutral-500 dark:from-white via-50% dark:via-white dark:to-neutral-600 bg-clip-text text-transparent">
            Gyűjteményem
          </h1>

          <div className="grid grid-cols-6 gap-4">
            {game.state.playerCards.map((card) => (
              <CardCard
                selected={
                  game.state.phase === "deck" &&
                  !!game.state.playerDeck.find((x) => x.id === card.id)
                }
                card={card}
                key={card.id}
                onClick={
                  game.state.phase === "deck"
                    ? () =>
                        setGame((prev) => ({
                          ...prev,
                          state: {
                            ...prev.state,
                            playerDeck: !prev.state.playerDeck.find(
                              (x) => x.id === card.id
                            )
                              ? [...prev.state.playerDeck, card]
                              : prev.state.playerDeck.filter(
                                  (x) => x.id !== card.id
                                ),
                          },
                        }))
                    : undefined
                }
              />
            ))}
          </div>
        </>
      )}

      {game.state.phase === "overview" && (
        <div className="w-full flex-1 flex justify-center items-center">
          <Button
            size={"lg"}
            onClick={() =>
              setGame((prev) => ({
                ...prev,
                state: {
                  ...prev.state,
                  phase: "deck",
                },
              }))
            }
          >
            <FileStack />
            Pakli összeállítása
          </Button>
        </div>
      )}

      {game.state.phase === "deck" && (
        <>
          <h1 className="font-medium mt-8 py-2 text-3xl bg-linear-to-b from-black via-black to-neutral-500 dark:from-white via-50% dark:via-white dark:to-neutral-600 bg-clip-text text-transparent">
            Paklim
          </h1>

          <div className="grid grid-cols-6 gap-4">
            {game.state.playerDeck.map((card) => (
              <CardCard
                card={card}
                key={card.id}
                onClick={
                  game.state.phase === "deck"
                    ? () =>
                        setGame((prev) => ({
                          ...prev,
                          state: {
                            ...prev.state,
                            playerDeck: prev.state.playerDeck.filter(
                              (x) => x.id !== card.id
                            ),
                          },
                        }))
                    : undefined
                }
              />
            ))}
          </div>

          {game.state.playerDeck.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 overflow-hidden bg-clip-padding rounded-xl">
              <span className="text-2xl font-medium">Üres a paklid</span>
              <span className="text-sm -mt-1 text-white/70 font-semibold leading-tight">
                Kattints egy kártyára a gyűjteményedben, hogy hozzáadd a
                paklidhoz!
              </span>
            </div>
          )}

          <div className="w-full flex justify-center items-center mt-4 pb-8">
            <Button
              disabled={game.state.playerDeck.length === 0}
              size={"lg"}
              onClick={() =>
                setGame((prev) => ({
                  ...prev,
                  state: {
                    ...prev.state,
                    phase: "dungeons",
                  },
                }))
              }
            >
              <Castle />
              Tovább a kazamatákhoz
            </Button>
          </div>
        </>
      )}

      {game.state.phase === "dungeons" && (
        <>
          <h1 className="font-medium mt-8 py-2 text-3xl bg-linear-to-b from-black via-black to-neutral-500 dark:from-white via-50% dark:via-white dark:to-neutral-600 bg-clip-text text-transparent flex justify-between items-center">
            <span>Kazamaták a világban</span>
            <Button
              onClick={() =>
                setGame((prev) => ({
                  ...prev,
                  state: {
                    ...prev.state,
                    phase: "deck",
                  },
                }))
              }
            >
              <ArrowLeft />
              Vissza a gyűjteményedhez
            </Button>
          </h1>

          <div className="flex flex-col gap-4">
            {game.state.dungeons.map((dungeon) => (
              <ShadcnCard>
                <CardHeader className="flex justify-between items-center">
                  <div className="flex flex-col gap-0">
                    <span className="text-xl font-medium">{dungeon.name}</span>
                    <span className="font-semibold text-muted-foreground">
                      {DUNGEON_TYPES[dungeon.type]}
                    </span>
                  </div>
                  <Button
                    disabled={
                      game.state.playerDeck.length !== dungeon.cards.length
                    }
                    onClick={() =>
                      setGame((prev) => ({
                        ...prev,
                        state: {
                          ...prev.state,
                          phase: "battle",
                          phaseData: {
                            dungeonId: dungeon.id,
                          },
                        },
                      }))
                    }
                  >
                    <Swords />
                    Irány a harc!
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-6 gap-4">
                    {dungeon.cards.map((card: Card) => (
                      <CardCard card={card} key={card.id} />
                    ))}
                  </div>
                </CardContent>
                {game.state.playerDeck.length !== dungeon.cards.length && (
                  <CardFooter className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle />
                      <span className="text-lg font-medium">
                        Nem {dungeon.cards.length} kártya van a paklidban!
                      </span>
                    </div>
                    <span className="text-center max-w-2xl text-muted-foreground">
                      Ahhoz, hogy beléphess ebbe a kazamatába, ugyanannyi
                      kártyádnak kell lenni a paklidban, mint amennyi ellenfél
                      vár rád.
                    </span>
                  </CardFooter>
                )}
              </ShadcnCard>
            ))}
          </div>
        </>
      )}

      {game.state.phase === "battle" && (
        <>
          <h1 className="font-medium mt-8 py-2 text-3xl bg-linear-to-b from-black via-black to-neutral-500 dark:from-white via-50% dark:via-white dark:to-neutral-600 bg-clip-text text-transparent text-center">
            {activeDungeon?.name}
          </h1>

          <div className="grid grid-cols-6 gap-4">
            {game.state.cards.map((card) => (
              <CardCard
                selected={
                  game.state.phase === "deck" &&
                  !!game.state.playerDeck.find((x) => x.id === card.id)
                }
                card={card}
                key={card.id}
                onClick={
                  game.state.phase === "deck"
                    ? () =>
                        setGame((prev) => ({
                          ...prev,
                          state: {
                            ...prev.state,
                            playerDeck: !prev.state.playerDeck.find(
                              (x) => x.id === card.id
                            )
                              ? [...prev.state.playerDeck, card]
                              : prev.state.playerDeck.filter(
                                  (x) => x.id !== card.id
                                ),
                          },
                        }))
                    : undefined
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
