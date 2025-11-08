import { Outlet } from "react-router";
import CardCollectionContextProvider from "~/context/CardCollectionContext";

export default function MasterIndex() {
  return <CardCollectionContextProvider>
    <Outlet></Outlet>
  </CardCollectionContextProvider>
}