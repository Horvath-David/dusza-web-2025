import { Plus } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";

const MasterGameField = () => {
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
        <Link to={"game"}>
          <Button>
            <Plus></Plus>Új játék létrehozzás
          </Button>
        </Link>
      </section>
    </main>
  );
};

export default MasterGameField;
