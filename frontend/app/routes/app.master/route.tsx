import { Outlet } from "react-router";
import CardCollectionContextProvider from "~/context/CardCollectionContext";
import DungeonContextProvider from "~/context/DungeonContext";
import MasterGeneralContextProvider from "~/context/MasterGeneralContext";

export default function MasterIndex() {
  return (
    <CardCollectionContextProvider>
      <DungeonContextProvider>
        <MasterGeneralContextProvider>
          <Outlet></Outlet>
        </MasterGeneralContextProvider>
      </DungeonContextProvider>
    </CardCollectionContextProvider>
  );
}
