import { Plus } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldSet } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { API_URL } from "~/constants";
import { MasterGeneralContext } from "~/context/MasterGeneralContext";

const MasterGameField = () => {
  const navi = useNavigate();

  const [gameName, setGameName] = useState<string>();

  const { worldId, setWorldId } = useContext(MasterGeneralContext);

  useEffect(() => {
    getWorlds();
  }, []);

  const getWorlds = async () => {
    const response = await fetch(API_URL + "/world/my", {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();
    console.log(data);
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

    console.log(data);
    setWorldId(parseInt(data.id));
    navi("game");
  };

  return (
    <main className="flex flex-col items-center">
      <h1 className="font-medium mt-8 py-2 text-3xl text-center bg-linear-to-b from-black via-black to-neutral-500 dark:from-white via-50% dark:via-white dark:to-neutral-600 bg-clip-text text-transparent">
        Üdvözlünk a játékaid között
      </h1>

      <section className="justify-center">
        <h1 className="font-medium mt-8 py-2 text-xl bg-linear-to-b from-black via-black to-neutral-500 dark:from-white via-50% dark:via-white dark:to-neutral-600 bg-clip-text text-transparent">
          Játékaid
        </h1>
        <div className="border-2 border-gray-500 rounded-2xl min-w-[50em] h-[20em]"></div>
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
};

export default MasterGameField;
