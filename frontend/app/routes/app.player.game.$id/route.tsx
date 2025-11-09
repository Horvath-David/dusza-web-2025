import { FileStack, Loader2, Swords } from "lucide-react";
import { API_URL } from "~/constants";
import { cn } from "~/lib/utils";
import type { GameStateResponse } from "~/models";
import type { Route } from "./+types/route";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const res = await fetch(`${API_URL}/state/${params.id}`, {
    method: "GET",
    credentials: "include",
  });
  const game = (await res.json()).game_state as GameStateResponse;

  return { game };
}

export default function PlayerGame({ loaderData }: Route.ComponentProps) {
  if (!loaderData.game) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl w-full h-full mx-auto flex flex-col gap-4">
      <h1 className="font-medium mt-8 py-2 text-3xl bg-linear-to-b from-black via-black to-neutral-500 dark:from-white via-50% dark:via-white dark:to-neutral-600 bg-clip-text text-transparent">
        Játék megtekintése
      </h1>

      <div className="grid grid-cols-5 gap-4">
        {loaderData.game.state.cards.map((card, i) => (
          <div
            key={card.id}
            className={cn(
              "bg-linear-to-bl h-56 from-green-500 to-red-500 rounded-xl w-full hover:brightness-110"
            )}
          >
            <div className="border border-white/20 cursor-pointer w-full h-full p-3 flex flex-col items-start justify-start gap-2 overflow-hidden bg-clip-padding rounded-xl">
              <span className="text-xl font-medium leading-none">
                {card.name}
              </span>
              <span className="text-sm -mt-1 text-white/70 font-semibold leading-none">
                by {card.type}
              </span>

              <div className="flex gap-4 justify-end items-center mt-auto pr-1 w-full font-semibold">
                <div className="flex gap-1 items-center">
                  <FileStack size={20} />
                  {card.is_boss}
                </div>
                <div className="flex gap-1 items-center">
                  <Swords size={20} />
                  {card.hp}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
