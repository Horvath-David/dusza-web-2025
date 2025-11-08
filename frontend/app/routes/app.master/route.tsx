import { Outlet } from "react-router";
import CardCollectionContextProvider from "~/context/CardCollectionContext";
import DungeonContextProvider from "~/context/DungeonContext";

export default function MasterIndex() {
  return (
    <CardCollectionContextProvider>
      <DungeonContextProvider>
        <Outlet></Outlet>
      </DungeonContextProvider>
    </CardCollectionContextProvider>
  );
}
