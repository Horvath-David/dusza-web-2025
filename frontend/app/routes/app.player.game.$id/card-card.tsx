import {
  Crown,
  Flame,
  Heart,
  Mountain,
  Swords,
  Waves,
  Wind,
} from "lucide-react";
import type React from "react";
import { TYPE_MAP } from "~/constants";
import { cn } from "~/lib/utils";
import type { Card } from "~/models";

export const typeColors: { [key: string]: string } = {
  fire: "bg-linear-to-bl from-red-700 to-yellow-800/50",
  water: "bg-linear-to-b from-blue-700 to-cyan-800/80",
  earth: "bg-linear-to-tr from-green-700 to-lime-800/50",
  air: "bg-linear-to-bl from-neutral-700 to-neutral-800/50",
};

export const typeIcons: { [key: string]: React.ReactNode } = {
  fire: <Flame size={16} />,
  water: <Waves size={16} />,
  earth: <Mountain size={16} />,
  air: <Wind size={16} />,
};

export function CardCard({
  card,
  selected,
  onClick,
}: {
  card: Card;
  selected?: boolean;
  onClick?: (card: Card) => any;
}) {
  return (
    <div
      className={cn(
        "bg-linear-to-bl h-52 from-green-500 to-red-500 rounded-xl w-full",
        onClick && "hover:brightness-110",
        typeColors[card.type]
      )}
      onClick={() => {
        onClick?.(card);
      }}
    >
      <div
        className={cn(
          "border border-white/20 w-full h-full p-4 flex flex-col items-center justify-start gap-2 overflow-hidden bg-clip-padding rounded-xl",
          onClick && "cursor-pointer",
          selected && "outline-4 outline-white/30 border-white/40"
        )}
      >
        <span className="text-xl font-semibold leading-none text-center">
          {card.name}
        </span>
        <span className="text-base text-white/70 font-semibold leading-none flex items-center gap-1">
          <span>{typeIcons[card.type]}</span>
          <span>{TYPE_MAP[card.type]}</span>
        </span>

        {card.is_boss && (
          <div className="flex justify-center items-center mt-auto w-full">
            <div className="flex gap-2 items-center font-medium text-base bg-black/30 border border-white/30 px-4 py-2 rounded-xl">
              <Crown size={20} />
              Vezér
            </div>
          </div>
        )}

        <div
          className={cn(
            "flex gap-4 justify-between items-center px-1 w-full mt-auto font-semibold"
          )}
        >
          <div className="flex gap-1 items-center text-lg">
            <Swords size={24} />
            {card.attack}
          </div>
          <div className="flex gap-1 items-center text-lg">
            <Heart size={24} />
            {card.hp}
          </div>
        </div>
      </div>
    </div>
  );
}
