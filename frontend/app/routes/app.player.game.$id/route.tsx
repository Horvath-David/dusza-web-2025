import {
  AlertTriangle,
  ArrowLeft,
  Castle,
  Check,
  FileStack,
  Heart,
  Loader2,
  Play,
  SkipForward,
  Swords,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  CardContent,
  CardFooter,
  CardHeader,
  Card as ShadcnCard,
} from "~/components/ui/card";
import { API_URL, DUNGEON_TYPES } from "~/constants";
import type { Card, GameStateResponse } from "~/models";
import type { Route } from "./+types/route";
import { CardCard } from "./card-card";

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
  const timeout = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    if (timeout.current) clearTimeout(timeout.current);

    timeout.current = setTimeout(async () => {
      const res = await fetch(`${API_URL}/state/save`, {
        method: "PUT",
        body: JSON.stringify(game),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    }, 500);

    return () => {
      clearTimeout(timeout.current);
    };
  }, [game]);

  function handleCardBattle() {
    setGame((prev) => ({
      ...prev,
      state: {
        ...prev.state,
        phase: "battle",
        phaseData: {
          ...prev.state.phaseData,
          fightPhase: "attack",
        },
      },
    }));

    let winner = "";

    const playerCard = game.state.playerCards[game.state.phaseData?.fightIndex];
    const enemyCard = activeDungeon?.cards[game.state.phaseData?.fightIndex]!;

    const playerKillsEnemy = playerCard.attack > enemyCard.hp;
    const enemyKillsPlayer = enemyCard.attack > playerCard.hp;

    if (playerKillsEnemy && !enemyKillsPlayer) {
      winner = "player";
    } else if (!playerKillsEnemy && enemyKillsPlayer) {
      winner = "enemy";
    } else {
      const types = ["fire", "earth", "water", "air"];
      if (
        (types.indexOf(playerCard.type) + 1) % 4 ===
        types.indexOf(enemyCard.type)
      ) {
        winner = "player";
      } else if (
        (types.indexOf(enemyCard.type) + 1) % 4 ===
        types.indexOf(playerCard.type)
      ) {
        winner = "enemy";
      } else {
        winner = "enemy";
      }
    }

    setTimeout(() => {
      setGame((prev) => ({
        ...prev,
        state: {
          ...prev.state,
          phase: "battle",
          phaseData: {
            ...prev.state.phaseData,
            fightPhase: "after",
            winner,
            playerWins:
              winner === "player"
                ? prev.state.phaseData.playerWins + 1
                : prev.state.phaseData.playerWins,
            enemyWins:
              winner === "enemy"
                ? prev.state.phaseData.enemyWins + 1
                : prev.state.phaseData.enemyWins,
          },
        },
      }));
    }, 1500);
  }

  function handleNextCard() {
    if (
      game.state.phaseData?.fightIndex ===
      (activeDungeon?.cards.length ?? 1) - 1
    ) {
      setGame((prev) => ({
        ...prev,
        state: {
          ...prev.state,
          phase:
            prev.state.phaseData?.playerWins >= prev.state.phaseData?.enemyWins
              ? "winner"
              : "loser",
        },
      }));
      return;
    }
    setGame((prev) => ({
      ...prev,
      state: {
        ...prev.state,
        phase: "battle",
        phaseData: {
          ...prev.state.phaseData,
          fightIndex: prev.state.phaseData?.fightIndex + 1,
          fightPhase: "before",
          winner: undefined,
        },
      },
    }));
  }

  function handleFinishDungeon() {
    setGame((prev) => {
      if (activeDungeon?.type === "basic") {
        const i = prev.state.playerCards.findIndex(
          (x) => x.id === game.state.phaseData?.selectedCard
        );
        prev.state.playerCards[i].attack += 1;
      }
      if (activeDungeon?.type === "small") {
        const i = prev.state.playerCards.findIndex(
          (x) => x.id === game.state.phaseData?.selectedCard
        );
        prev.state.playerCards[i].hp += 2;
      }
      if (activeDungeon?.type === "big") {
        const i = prev.state.playerCards.findIndex(
          (x) => x.id === game.state.phaseData?.selectedCard
        );
        prev.state.playerCards[i].attack += 3;
      }

      return {
        ...prev,
        state: {
          ...prev.state,
          phase: "deck",
          playerDeck: prev.state.playerDeck.map(
            (x) => prev.state.playerCards.find((y) => y.id === x.id)!
          ),
        },
      };
    });
  }

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

          <div className="flex flex-1 flex-col gap-4 w-full">
            <div className="flex flex-col gap-4 justify-start">
              <div className="flex *:w-42 gap-4 [zoom:0.66] w-2/3">
                {game.state.playerDeck.map((card, idx) => (
                  <CardCard
                    selected={game.state.phaseData?.fightIndex === idx}
                    card={card}
                    key={card.id}
                  />
                ))}
              </div>
              <h2 className="font-medium -mt-2 py-1 text-2xl bg-linear-to-b from-black via-black to-neutral-500 dark:from-white via-50% dark:via-white dark:to-neutral-600 bg-clip-text text-transparent text-left">
                Saját pakli
              </h2>
            </div>
          </div>

          <div className="flex-2 flex flex-col gap-12 w-full justify-center items-center">
            {game.state.phaseData?.fightIndex === undefined && (
              <Button
                onClick={() =>
                  setGame((prev) => ({
                    ...prev,
                    state: {
                      ...prev.state,
                      phase: "battle",
                      phaseData: {
                        dungeonId: activeDungeon?.id,
                        fightIndex: 0,
                        fightPhase: "before",
                        playerWins: 0,
                        enemyWins: 0,
                      },
                    },
                  }))
                }
              >
                <Play />
                Kezdés
              </Button>
            )}

            {game.state.phaseData?.fightIndex !== undefined && (
              <>
                <div className="flex w-full justify-center gap-12">
                  <div className="w-42">
                    <CardCard
                      card={
                        game.state.playerCards[game.state.phaseData?.fightIndex]
                      }
                      selected={game.state.phaseData?.winner === "player"}
                    />
                  </div>

                  <div className="w-42">
                    <CardCard
                      card={
                        activeDungeon?.cards[game.state.phaseData?.fightIndex]!
                      }
                      selected={game.state.phaseData?.winner === "enemy"}
                    />
                  </div>
                </div>

                {game.state.phaseData?.fightPhase === "before" && (
                  <Button onClick={handleCardBattle}>
                    <Swords />
                    Csata!
                  </Button>
                )}

                {game.state.phaseData?.fightPhase === "attack" && (
                  <Button disabled>
                    <Loader2 className="animate-spin" />
                    Csata!
                  </Button>
                )}

                {game.state.phaseData?.fightPhase === "after" && (
                  <>
                    <Button onClick={handleNextCard}>
                      <SkipForward />
                      {game.state.phaseData?.fightIndex ===
                      (activeDungeon?.cards.length ?? 1) - 1
                        ? "Összegzés"
                        : "Következő páros"}
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-4 w-full">
            <div className="flex flex-col gap-4 justify-end">
              <h2 className="font-medium -mt-2 py-1 text-2xl bg-linear-to-b from-black via-black to-neutral-500 dark:from-white via-50% dark:via-white dark:to-neutral-600 bg-clip-text text-transparent text-right">
                Ellenfelek
              </h2>
              <div className="flex justify-end gap-4 [zoom:0.66] *:w-42 w-2/3 ml-auto">
                {activeDungeon?.cards.map((card, idx) => (
                  <CardCard
                    selected={game.state.phaseData?.fightIndex === idx}
                    card={card}
                    key={card.id}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {game.state.phase === "winner" && (
        <div className="flex flex-col items-center justify-center gap-4 overflow-hidden bg-clip-padding rounded-xl">
          <h1 className="font-medium mt-8 py-2 text-4xl bg-linear-to-b from-black via-black to-neutral-500 dark:from-white via-50% dark:via-white dark:to-neutral-600 bg-clip-text text-transparent">
            Nyertél!
          </h1>
          <span className="text-sm -mt-1 text-white/70 font-semibold leading-tight">
            Válaszd ki, hogy melyik kártyádat szeretnéd fejleszteni!
          </span>

          <div className="text-lg px-4 py-2 bg-white/5 border border-white/20 rounded-xl gap-2 w-full h-full flex justify-center items-center">
            Jutalmad:
            {activeDungeon?.type === "basic" ? (
              <span className="flex gap-1 items-center font-semibold">
                <span>+1</span>
                <Swords />
              </span>
            ) : activeDungeon?.type === "small" ? (
              <span className="flex gap-1 items-center font-semibold">
                <span>+2</span>
                <Heart />
              </span>
            ) : activeDungeon?.type === "big" ? (
              <span className="flex gap-1 items-center font-semibold">
                <span>+3</span>
                <Swords />
              </span>
            ) : (
              ""
            )}
          </div>

          <div className="grid w-full grid-cols-6 gap-4">
            {game.state.playerCards.map((card) => (
              <CardCard
                card={card}
                key={card.id}
                selected={game.state.phaseData?.selectedCard === card.id}
                onClick={() =>
                  setGame((prev) => ({
                    ...prev,
                    state: {
                      ...prev.state,
                      phaseData: {
                        ...prev.state.phaseData,
                        selectedCard: card.id,
                      },
                    },
                  }))
                }
              />
            ))}
          </div>

          {game.state.phaseData?.selectedCard && (
            <div className="w-full flex mt-8 pb-8 justify-center items-center">
              <Button size={"lg"} onClick={handleFinishDungeon}>
                <Check />
                Befejezés
              </Button>
            </div>
          )}
        </div>
      )}

      {game.state.phase === "loser" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-hidden bg-clip-padding rounded-xl">
          <h1 className="font-medium mt-8 py-2 text-4xl bg-linear-to-b from-black via-black to-neutral-500 dark:from-white via-50% dark:via-white dark:to-neutral-600 bg-clip-text text-transparent">
            Vesztettél!
          </h1>
          <span className="text-sm -mt-1 text-white/70 font-semibold leading-tight">
            Nem jártál sikerrel, ezért most nem kapsz jutalmakat. Viszont
            bármikor újrapróbálhatod!
          </span>

          <div className="w-full flex justify-center items-center">
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
              Vissza a gyűjteményedhez
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
