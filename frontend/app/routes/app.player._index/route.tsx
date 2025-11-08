import { FileStack, Search, Swords } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router";
import { buttonVariants } from "~/components/ui/button";
import { API_URL } from "~/constants";
import { cn } from "~/lib/utils";
import type { World } from "~/models";
import type { Route } from "./+types/route";

export async function clientLoader() {
  const res = await fetch(`${API_URL}/world/all`, {
    method: "GET",
    credentials: "include",
  });
  const worlds = (await res.json()).worlds as World[];

  console.log(worlds);

  // return { worlds };
  return {
    worlds: [
      ...worlds,
      ...worlds,
      ...worlds,
      ...worlds,
      ...worlds,
      ...worlds,
      ...worlds,
      ...worlds,
    ],
  };
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
        Felfedezni váró világok
      </h1>

      <div className="grid grid-cols-5 gap-4">
        {loaderData.worlds.slice(0, 5).map((world, i) => (
          <div
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
                by @{world.owner}
              </span>

              <div className="flex gap-4 justify-end items-center mt-auto pr-1 w-full font-semibold">
                <div className="flex gap-1 items-center">
                  <FileStack size={20} />9
                </div>
                <div className="flex gap-1 items-center">
                  <Swords size={20} />4
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

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
        {loaderData.worlds.slice(0, 4).map((world, i) => (
          <div
            key={world.id}
            className={cn(
              "bg-linear-to-bl h-56 from-cyan-700 filter-[grayscale(1)] duration-400 hover:filter-[grayscale(0)] to-blue-800/20 rounded-xl w-full hover:brightness-120 transition-[filter] hover:transition-[filter]"
            )}
          >
            <div className="border border-white/20 cursor-pointer w-full h-full p-3 flex flex-col items-start justify-start gap-2 overflow-hidden bg-clip-padding rounded-xl">
              <span className="text-xl font-medium leading-none">
                {world.name}
              </span>
              <span className="text-sm -mt-1 text-white/70 font-semibold leading-none">
                by @{world.owner}
              </span>

              <div className="flex gap-4 justify-end items-center mt-auto pr-1 w-full font-semibold">
                <div className="flex gap-1 items-center">
                  <FileStack size={20} />9
                </div>
                <div className="flex gap-1 items-center">
                  <Swords size={20} />4
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loaderData.worlds.length > 5 && (
        <Link
          to="/app/player/games"
          className={buttonVariants({
            variant: "secondary",
            className: "w-fit mx-auto",
          })}
        >
          <Search />
          <span>További {loaderData.worlds.length - 5} játék megtekintése</span>
        </Link>
      )}
    </div>
  );
}
