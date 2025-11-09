import { FileStack, Loader2, Play, Swords } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSubmit } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { API_URL } from "~/constants";
import { cn } from "~/lib/utils";
import type { Card, Dungeon, World } from "~/models";
import type { Route } from "./+types/route";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const res = await fetch(`${API_URL}/world/${params.worldId}`, {
    method: "GET",
    credentials: "include",
  });
  const world = (await res.json()).world as World;

  return { world };
}

export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const worldRes = await fetch(`${API_URL}/world/${params.worldId}`, {
    method: "GET",
    credentials: "include",
  });
  const world = (await worldRes.json()).world as World;

  const cardsRes = await fetch(`${API_URL}/world/${params.worldId}/cards`, {
    method: "GET",
    credentials: "include",
  });
  const cards = (await cardsRes.json()).cards as Card[];

  const dungeonsRes = await fetch(
    `${API_URL}/world/${params.worldId}/dungeons`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  const dungeons = (await dungeonsRes.json()).dungeons as Dungeon[];

  const state = {
    world_id: params.worldId,
    state: {
      name: (data.name as string) || world.name,
      cards,
      dungeons,
      playerCards: world.player_cards,
      playerDeck: [],
      phase: "overview",
    },
  };

  try {
    const res = await fetch(`${API_URL}/state/save`, {
      method: "PUT",
      body: JSON.stringify(state),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (res.status === 200) {
      const id = (await res.json()).id;
      return { ok: true, id };
    }

    return { ok: false };
  } catch (e) {
    return { ok: false };
  }
}

export default function PlayerCreateGame({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const [name, setName] = useState("");
  const submit = useSubmit();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
    if (actionData?.ok) {
      navigate(`/app/player/game/${actionData.id}`);
    }
  }, [actionData]);

  return (
    <div className="p-4 max-w-5xl w-full h-full mx-auto flex flex-col gap-4">
      <div className="flex flex-col flex-1 items-center justify-center">
        <h1 className="font-medium mt-8 py-2 text-center text-3xl bg-linear-to-b from-black via-black to-neutral-500 dark:from-white via-50% dark:via-white dark:to-neutral-600 bg-clip-text text-transparent">
          Új játék létrehozása
        </h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            setLoading(true);
            await submit(
              {
                name,
              },
              { method: "post" }
            );
          }}
          className="h-48 gap-4 flex flex-col items-center justify-center mx-auto w-full max-w-lg"
        >
          <div className="grid gap-2 w-full">
            <div className="flex items-center">
              <Label htmlFor="name">Játék neve</Label>
            </div>
            <Input
              autoFocus
              id="name"
              name="name"
              type="text"
              placeholder={loaderData.world.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            {loading ? <Loader2 className="animate-spin" /> : <Play />}
            <span className="">Vágjunk bele!</span>
          </Button>
        </form>
      </div>

      <div className="gap-4">
        <div
          key={loaderData.world.id}
          className={cn(
            "bg-linear-to-bl h-36 from-purple-800 to-red-800 rounded-xl w-full hover:brightness-110"
          )}
        >
          <div className="border border-white/20 cursor-pointer w-full h-full p-3 flex flex-col items-start justify-start gap-2 overflow-hidden bg-clip-padding rounded-xl">
            <span className="text-xl font-medium leading-none">
              {loaderData.world.name}
            </span>
            <span className="text-sm -mt-1 text-white/70 font-semibold leading-none">
              készítő: {loaderData.world.owner}
            </span>

            <div className="flex gap-4 justify-end items-center mt-auto pr-1 w-full font-semibold">
              <div className="flex gap-1 items-center">
                <FileStack size={20} />
                {loaderData.world.cards}
              </div>
              <div className="flex gap-1 items-center">
                <Swords size={20} />
                {loaderData.world.dungeons}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
