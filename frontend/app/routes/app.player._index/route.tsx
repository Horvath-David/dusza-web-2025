import { Clock, FileStack, Search, Swords } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router";
import { buttonVariants } from "~/components/ui/button";
import { API_URL } from "~/constants";
import { cn, timeAgo } from "~/lib/utils";
import type { GameStateResponse, World } from "~/models";
import type { Route } from "./+types/route";

export async function clientLoader() {
  const res = await fetch(`${API_URL}/world/all`, {
    method: "GET",
    credentials: "include",
  });
  const worlds = (await res.json()).worlds as World[];

  console.log(worlds);

  const gamesRes = await fetch(`${API_URL}/state/my`, {
    method: "GET",
    credentials: "include",
  });
  const games = (await gamesRes.json()).game_states as GameStateResponse[];

  console.log({ worlds, games });

  return { worlds, games };
}

const randomColors = [
  "bg-gradient-to-r from-green-800 to-red-700",
  "bg-gradient-to-br from-violet-800 to-red-700",
  "bg-gradient-to-tr from-blue-800 to-yellow-800",
  "bg-gradient-to-bl from-cyan-700 to-blue-800",
  "bg-gradient-to-tl from-pink-700 to-orange-800",
];

export default function PlayerIndex({ loaderData }: Route.ComponentProps) {
  useEffect(() => {
    console.log(loaderData);
  }, [loaderData]);

  return (
    <div className="p-4 max-w-5xl w-full h-full mx-auto flex flex-col gap-4">
      <h1 className="font-medium mt-8 py-2 text-3xl bg-linear-to-b from-black via-black to-neutral-500 dark:from-white via-50% dark:via-white dark:to-neutral-600 bg-clip-text text-transparent">
        Felfedezésre váró világok
      </h1>

      <div className="grid grid-cols-5 gap-4">
        {loaderData.worlds.slice(0, 5).map((world, i) => (
          <Link
            to={`/app/player/create-game/${world.id}`}
            key={world.id}
            className={cn(
              "bg-linear-to-bl h-56 from-green-500 to-red-500 rounded-xl w-full hover:brightness-110",
              randomColors[i]
            )}
          >
            <div className="border border-white/20 cursor-pointer w-full h-full p-3 flex flex-col items-start justify-start gap-2 overflow-hidden bg-clip-padding rounded-xl">
              <span className="text-xl font-medium leading-none">
                {world.name}
              </span>
              <span className="text-sm -mt-1 text-white/70 font-semibold leading-none">
                by {world.owner}
              </span>

              <div className="flex gap-4 justify-end items-center mt-auto pr-1 w-full font-semibold">
                <div className="flex gap-1 items-center">
                  <FileStack size={20} />
                  {world.cards}
                </div>
                <div className="flex gap-1 items-center">
                  <Swords size={20} />
                  {world.dungeons}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {loaderData.worlds.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 overflow-hidden bg-clip-padding rounded-xl">
          <span className="text-2xl font-medium">Nincsenek még világok</span>
          <span className="text-sm -mt-1 text-white/70 font-semibold leading-none">
            Nézz vissza később, vagy alkoss egy újat a játékmester nézetben!
          </span>
        </div>
      )}

      {loaderData.worlds.length > 5 && (
        <Link
          to="/app/player/worlds"
          className={buttonVariants({
            variant: "secondary",
            className: "w-fit mx-auto",
          })}
        >
          <Search />
          <span>További {loaderData.worlds.length - 5} világ megtekintése</span>
        </Link>
      )}

      <h1 className="font-medium mt-8 py-2 text-3xl bg-linear-to-b from-black via-black to-neutral-500 dark:from-white via-50% dark:via-white dark:to-neutral-600 bg-clip-text text-transparent">
        Térj vissza mentett játékaidhoz
      </h1>

      <div className="grid grid-cols-4 gap-4">
        {loaderData.games.slice(0, 4).map((game, i) => (
          <div
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
          </div>
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

      {loaderData.games.length > 4 && (
        <Link
          to="/app/player/games"
          className={buttonVariants({
            variant: "secondary",
            className: "w-fit mx-auto",
          })}
        >
          <Search />
          <span>További {loaderData.worlds.length - 4} játék megtekintése</span>
        </Link>
      )}
    </div>
  );
}
