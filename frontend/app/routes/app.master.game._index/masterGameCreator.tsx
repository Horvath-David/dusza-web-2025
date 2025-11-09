import { ArrowLeft, Book, Castle, Scroll } from "lucide-react";
import { useContext, useEffect } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { MasterGeneralContext } from "~/context/MasterGeneralContext";

const MasterGameCreator = () => {
  return (
    <main className="h-full flex flex-col">
      <Link to={"/app/master/"}>
        <Button className="absolute top-[90%] left-[1%]" variant={"outline"}>
          <ArrowLeft></ArrowLeft>
          Vissza
        </Button>
      </Link>
      <div className="h-full w-full flex-1"></div>

      <h1 className="font-medium py-2 text-5xl text-center bg-linear-to-b from-black via-black to-neutral-500 dark:from-white via-50% dark:via-white dark:to-neutral-600 bg-clip-text text-transparent">
        Hozd létre játékod
      </h1>

      <div className="w-full h-full flex-2 flex flex-row gap-8 p-10">
        <Link
          to="collection"
          className="bg-linear-to-bl from-green-800 to-red-800 rounded-3xl w-full h-full hover:brightness-110"
        >
          <div className="border-3 border-white/20 w-full h-full flex flex-col items-center justify-center gap-4 overflow-hidden bg-clip-padding rounded-3xl">
            <Book size={70}></Book>
            <span className="text-2xl font-medium">Menj a gyűjteményedhez</span>
          </div>
        </Link>

        <Link
          to="dungeon"
          className="bg-linear-to-br from-cyan-800 to-violet-800 rounded-3xl w-full h-full hover:brightness-110"
        >
          <div className="border-3 border-white/20 w-full h-full flex flex-col items-center justify-center gap-4 overflow-hidden bg-clip-padding rounded-3xl">
            <Castle size={70}></Castle>
            <span className="text-2xl font-medium">Hozz létre kazamatákat</span>
          </div>
        </Link>

        <Link
          to="player"
          className="bg-linear-to-br from-amber-600 to-red-700 rounded-3xl w-full h-full hover:brightness-110"
        >
          <div className="border-3 border-white/20 w-full h-full flex flex-col items-center justify-center gap-4 overflow-hidden bg-clip-padding rounded-3xl">
            <Scroll size={70}></Scroll>
            <span className="text-2xl font-medium">
              Állítsd be a játékos gyűjteményét
            </span>
          </div>
        </Link>
      </div>
      <div className="h-full w-full flex-1"></div>
      {/* <Link to={"collection"}>
        <Button>Menj a gyűjteményedhez</Button>
      </Link>

      <Link to={"dungeon"}>
        <Button>Hozz létre kazamatákat</Button>
      </Link> */}
    </main>
  );
};

export default MasterGameCreator;
