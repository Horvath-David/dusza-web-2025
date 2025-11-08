import { redirect } from "react-router";

export async function clientLoader() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  if (res.status !== 200) {
    return redirect("/");
  }
}

export default function App() {
  return <div>App</div>;
}
