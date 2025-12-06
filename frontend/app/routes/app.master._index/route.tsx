import {
  ArrowLeft,
  FileStack,
  Pencil,
  Plus,
  Swords,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useRevalidator } from "react-router";
import { toast } from "sonner";
import { Button, buttonVariants } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Field, FieldLabel, FieldSet } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
} from "~/components/ui/item";
import { Separator } from "~/components/ui/separator";
import { API_URL } from "~/constants";
import type { World } from "~/models";
import type { Route } from "./+types/route";

export async function clientLoader() {
  const res = await fetch(`${API_URL}/world/my`, {
    method: "GET",
    credentials: "include",
  });
  const worlds = (await res.json()).worlds as World[];

  return { worlds };
}

export default function MasterIndex({ loaderData }: Route.ComponentProps) {
  const navi = useNavigate();
  const revalidator = useRevalidator();

  const [gameName, setGameName] = useState<string>();

  const { worlds } = loaderData;

  const OnWorldDelete = async (id: number) => {
    const response = await fetch(API_URL + `/world/${id}/delete`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      toast.error("Valami nem sikerült");
      return;
    }

    await revalidator.revalidate();

    toast.success("Sikeres törlés");
    return;
  };

  const OnSubmits = async () => {
    const response = await fetch(API_URL + "/world/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: gameName,
      }),
      credentials: "include",
    });

    if (!response.ok) {
      toast.error("Valami nem sikerült");
      return;
    }

    const data = await response.json();
    navi(`/app/master/game/${data.id}`);
  };

  return (
    <main className="flex flex-col items-center">
      <Link to={"/app/"}>
        <Button className="absolute top-[90%] left-[1%]" variant={"outline"}>
          <ArrowLeft></ArrowLeft>
          Vissza
        </Button>
      </Link>
      <h1 className="font-medium mt-8 py-2 text-3xl text-center bg-linear-to-b from-black via-black to-neutral-500 dark:from-white via-50% dark:via-white dark:to-neutral-600 bg-clip-text text-transparent">
        Üdvözlünk a játékaid között
      </h1>

      <section className="justify-center">
        <h1 className="font-medium mt-8 py-2 text-xl bg-linear-to-b from-black via-black to-neutral-500 dark:from-white via-50% dark:via-white dark:to-neutral-600 bg-clip-text text-transparent">
          Játékaid
        </h1>
        <Card className="rounded-2xl p-2 min-w-[50em] h-[65vh] overflow-auto">
          <CardContent className="p-0">
            {worlds.map((e) => {
              return (
                <>
                  <Item>
                    <ItemContent>
                      <ItemHeader className="font-bold text-xl">
                        {e.name}
                      </ItemHeader>
                      <ItemDescription className="flex gap-2">
                        <span className="flex justify-center gap-1">
                          {e.dungeons}
                          <Swords></Swords>
                        </span>
                        <span className="flex justify-center gap-1">
                          {e.cards}
                          <FileStack></FileStack>
                        </span>
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Link
                        to={`/app/master/game/${e.id}`}
                        className={buttonVariants()}
                      >
                        <Pencil></Pencil>
                      </Link>
                      <Button
                        variant={"destructive"}
                        onClick={() => {
                          OnWorldDelete(e.id);
                        }}
                      >
                        <Trash></Trash>
                      </Button>
                    </ItemActions>
                  </Item>
                  <Separator></Separator>
                </>
              );
            })}
          </CardContent>
        </Card>
      </section>

      <section className="mt-9">
        <Dialog>
          <DialogTrigger>
            <Button>
              <Plus></Plus>Új játék létrehozzás
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>Új játék</DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                OnSubmits();
              }}
              className="space-y-6"
            >
              <FieldSet>
                <Field>
                  <FieldLabel>Játék neve: </FieldLabel>
                  <Input
                    type="text"
                    required
                    value={gameName}
                    onChange={(e) => {
                      setGameName(e.target.value);
                    }}
                  ></Input>
                </Field>
              </FieldSet>
              <Button type="submit">
                <Plus></Plus>Új játék létrehozzás
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </section>
    </main>
  );
}
