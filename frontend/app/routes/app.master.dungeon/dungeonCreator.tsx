import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";

const DungeonCreator = () => {
  return (
    <main className="p-5">
      <Link to={"/master"}>
        <Button className="absolute">
          <ArrowLeft></ArrowLeft>
          Vissza
        </Button>
      </Link>
      <h1 className="text-5xl font-bold text-center">Kazamaták</h1>
    </main>
  );
};

export default DungeonCreator;
