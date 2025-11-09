import { Outlet } from "react-router";
import CardCollectionContextProvider from "~/context/CardCollectionContext";
import DungeonContextProvider from "~/context/DungeonContext";
import MasterGeneralContextProvider from "~/context/MasterGeneralContext";
import { PlayerDeckProvider } from "~/context/playerCardContext";

export default function MasterIndex() {
  return (
    <CardCollectionContextProvider>
      <DungeonContextProvider>
        <MasterGeneralContextProvider>
          <PlayerDeckProvider>
            <Outlet></Outlet>
          </PlayerDeckProvider>
        </MasterGeneralContextProvider>
      </DungeonContextProvider>
    </CardCollectionContextProvider>
  );
}
