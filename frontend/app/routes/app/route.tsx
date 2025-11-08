import { Outlet, redirect } from "react-router";
import { Header } from "~/components/header";
import { UserContextProvider } from "~/context/UserContext";
import type { UserMe } from "~/models";
import type { Route } from "./+types/route";
import { API_URL } from "~/constants";

export async function clientLoader() {
  const res = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  if (res.status !== 200) {
    return redirect("/");
  }

  const json = await res.json();
  return json.user as UserMe;
}

export default function App({ loaderData }: Route.ComponentProps) {
  return (
    <UserContextProvider initial={loaderData}>
      <div className="w-screen h-screen overflow-hidden flex flex-col">
        <Header />
        <div className="flex-1 w-full h-full overflow-x-hidden overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </UserContextProvider>
  );
}
