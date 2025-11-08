import { Swords, WandSparkles } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router";
import { UserContext } from "~/context/UserContext";

export default function AppIndex() {
  const { user } = useContext(UserContext);

  return (
    <div className="p-4 max-w-4xl w-full h-full mx-auto flex flex-col gap-8">
      <div className="w-full h-full flex-1 flex items-end justify-center text-center">
        <span className="font-medium py-2 text-5xl bg-linear-to-b from-black via-black to-neutral-500 dark:from-white via-50% dark:via-white dark:to-neutral-600 bg-clip-text text-transparent">
          Üdv, {user.display_name}!
        </span>
      </div>
      <div className="w-full h-full flex-2 flex flex-row gap-8">
        <Link
          to="/app/player"
          className="bg-linear-to-bl from-green-800 to-red-800 rounded-3xl w-full h-full hover:brightness-110"
        >
          <div className="border-3 border-white/20 w-full h-full flex flex-col items-center justify-center gap-4 overflow-hidden bg-clip-padding rounded-3xl">
            <Swords size={80} />
            <span className="text-2xl font-medium">Játékos nézet</span>
          </div>
        </Link>

        <Link
          to="/app/master"
          className="bg-linear-to-br from-cyan-800 to-violet-800 rounded-3xl w-full h-full hover:brightness-110"
        >
          <div className="border-3 border-white/20 w-full h-full flex flex-col items-center justify-center gap-4 overflow-hidden bg-clip-padding rounded-3xl">
            <WandSparkles size={80} />
            <span className="text-2xl font-medium">Játékmester nézet</span>
          </div>
        </Link>
      </div>
      <div className="w-full h-full flex-1"></div>
    </div>
  );
}
