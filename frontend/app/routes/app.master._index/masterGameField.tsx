import { Link } from "react-router";
import { Button } from "~/components/ui/button";

const MasterGameField = () => {
  return (
    <main>
      <Link to={"collection"}>
        <Button>Menj a gyűjteményedhez</Button>
      </Link>

      <Link to={"dungeon"}>
        <Button>Hozzlétre kazamatákat</Button>
      </Link>
    </main>
  );
};

export default MasterGameField;
