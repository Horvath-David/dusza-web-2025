import { FileStack, Swords } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router";
import { API_URL } from "~/constants";
import { cn, timeAgo } from "~/lib/utils";
import type { GameStateResponse } from "~/models";
import type { Route } from "./+types/route";

export async function clientLoader() {
  const gamesRes = await fetch(`${API_URL}/state/my`, {
    method: "GET",
    credentials: "include",
  });
  const games = (await gamesRes.json()).game_states as GameStateResponse[];

  console.log({ games });

  return { games };
}

export default function PlayerGames({ loaderData }: Route.ComponentProps) {
  useEffect(() => {
    console.log(loaderData);
  }, [loaderData]);

  return (
    <div className="p-4 max-w-5xl w-full h-full mx-auto flex flex-col gap-4">
      <h1 className="font-medium mt-8 py-2 text-3xl bg-linear-to-b from-black via-black to-neutral-500 dark:from-white via-50% dark:via-white dark:to-neutral-600 bg-clip-text text-transparent">
        Összes mentett játék
      </h1>
      <div className="grid grid-cols-4 gap-4">
        {loaderData.games.map((game) => (
          <Link
            to={`/app/player/game/${game.id}`}
            key={game.id}
            className={cn(
              "bg-linear-to-bl h-56 from-cyan-700 filter-[grayscale(1)] duration-400 hover:filter-[grayscale(0)] to-blue-800/20 rounded-xl w-full hover:brightness-120 transition-[filter] hover:transition-[filter]"
            )}
          >
            <div className="border border-white/20 cursor-pointer w-full h-full p-3 flex flex-col items-start justify-start gap-2 overflow-hidden bg-clip-padding rounded-xl">
              <span className="text-xl font-medium leading-none">
                {game.state?.name}
              </span>
              <span className="text-sm -mt-1 text-white/70 font-semibold leading-none">
                {timeAgo(new Date(game.created_at))}
              </span>

              <div className="flex gap-4 justify-end items-center pr-1 w-full mt-auto font-semibold">
                <span className="text-xl font-bold text-muted-foreground mr-auto ml-1">
                  #{game.id}
                </span>

                <div className="flex gap-1 items-center">
                  <FileStack size={20} />
                  {game.state?.cards.length}
                </div>
                <div className="flex gap-1 items-center">
                  <Swords size={20} />
                  {game.state?.dungeons.length}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {loaderData.games.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 overflow-hidden bg-clip-padding rounded-xl">
          <span className="text-2xl font-medium">
            Nincsenek mentett játékok
          </span>
          <span className="text-sm -mt-1 text-white/70 font-semibold leading-none">
            Kezdj el játszani egy világgal!
          </span>
        </div>
      )}
    </div>
  );
}
