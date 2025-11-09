import { FileStack, Swords } from "lucide-react";
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

  return { worlds };
}

const randomColors = [
  "bg-gradient-to-r from-green-800 to-red-700",
  "bg-gradient-to-br from-violet-800 to-red-700",
  "bg-gradient-to-tr from-blue-800 to-yellow-800",
  "bg-gradient-to-bl from-cyan-700 to-blue-800",
  "bg-gradient-to-tl from-pink-700 to-orange-800",
  "bg-gradient-to-tl from-lime-800 to-cyan-700",
  "bg-gradient-to-b from-purple-800 to-blue-800",
  "bg-gradient-to-tr from-green-700 to-red-800",
  "bg-gradient-to-br from-blue-800 to-cyan-800",
];

export default function PlayerWorlds({ loaderData }: Route.ComponentProps) {
  return (
    <div className="p-4 max-w-5xl w-full h-full mx-auto flex flex-col gap-4">
      <h1 className="font-medium mt-8 py-2 text-3xl bg-linear-to-b from-black via-black to-neutral-500 dark:from-white via-50% dark:via-white dark:to-neutral-600 bg-clip-text text-transparent">
        Összes felfedezhető világ
      </h1>

      <div className="grid grid-cols-5 gap-4 pb-8">
        {loaderData.worlds.map((world, i) => (
          <div
            key={world.id}
            className={cn(
              "bg-linear-to-bl h-56 from-green-500 to-red-500 rounded-xl w-full hover:brightness-110",
              randomColors[i % randomColors.length]
            )}
          >
            <div className="border border-white/20 cursor-pointer w-full h-full p-3 flex flex-col items-start justify-start gap-2 overflow-hidden bg-clip-padding rounded-xl">
              <span className="text-xl font-medium leading-none">
                {world.name}
              </span>
              <span className="text-sm -mt-1 text-white/70 font-semibold leading-none">
                készítő: {world.owner}
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
          </div>
        ))}
      </div>

      {loaderData.worlds.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 overflow-hidden bg-clip-padding rounded-xl">
          <span className="text-2xl font-medium">Nincsenek még világok</span>
          <span className="text-sm -mt-1 text-white/70 font-semibold leading-tight">
            Nézz vissza később, vagy alkoss egy újat a játékmester nézetben!
          </span>
        </div>
      )}
    </div>
  );
}
