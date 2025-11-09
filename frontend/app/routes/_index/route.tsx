import { Loader2, LogIn, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { redirect, useNavigate, useSubmit } from "react-router";
import { toast } from "sonner";
import { Logo } from "~/components/Logo";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { API_URL } from "~/constants";
import { cn } from "~/lib/utils";
import type { Route } from "./+types/route";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Bejelentkezés | Damareen" }];
}

export async function clientLoader() {
  const res = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  if (res.status === 200) {
    return redirect("/app");
  }
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();

  console.log(Object.fromEntries(formData));

  try {
    if (formData.get("signUp") === "true") {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.status === 200) {
        toast.success("Sikeres regisztráció!");
        return { ok: true };
      }

      toast.error("Hiba történt a regisztráció során.");
      return { ok: false };
    }
  } catch (e) {
    toast.error("Hiba történt a regisztráció során.");
    return { ok: false };
  }

  try {
    if (formData.get("signUp") === "false") {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.status === 200) {
        toast.success("Sikeres bejelentkezés!");
        return { ok: true };
      }

      if (res.status === 401 || res.status === 403) {
        toast.error("A felhasználónév vagy jelszó hibás.");
        return { ok: false };
      }

      toast.error("Hiba történt a bejelentkezés során.");
      return { ok: false };
    }
  } catch (e) {
    toast.error("Hiba történt a bejelentkezés során.");
    return { ok: false };
  }
}

export default function Home({ actionData }: Route.ComponentProps) {
  const submit = useSubmit();
  const navigate = useNavigate();

  const [signUp, setSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(actionData);
    if (actionData?.ok) {
      navigate("/app");
    }
    setLoading(false);
  }, [actionData]);

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col items-center justify-center gap-6">
      <Logo />

      <form
        className="w-full max-w-sm"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          await submit(
            {
              username,
              password,
              display_name: displayName,
              signUp,
            },
            { method: "post" }
          );
        }}
      >
        <Card className="">
          <CardHeader>
            <div>
              <CardTitle className="grid grid-rows-1 grid-cols-1">
                <span
                  className={cn(
                    "opacity-0 row-start-1 row-end-1 col-start-1 col-end-1 transition-opacity pointer-events-none",
                    signUp && "opacity-100 pointer-events-auto"
                  )}
                >
                  Regisztrálj
                </span>

                <span
                  className={cn(
                    "opacity-100 row-start-1 row-end-1 col-start-1 col-end-1 transition-opacity",
                    signUp && "opacity-0 pointer-events-none"
                  )}
                >
                  Jelentkezz be
                </span>
              </CardTitle>
            </div>

            <CardDescription className="grid grid-rows-1 grid-cols-1">
              <span
                className={cn(
                  "opacity-0 row-start-1 row-end-1 col-start-1 col-end-1 transition-opacity pointer-events-none",
                  signUp && "opacity-100 pointer-events-auto"
                )}
              >
                Készíts egy új fiókot, és fedezz fel számtalan izgalmas világot!
              </span>

              <span
                className={cn(
                  "opacity-100 row-start-1 row-end-1 col-start-1 col-end-1 transition-opacity",
                  signUp && "opacity-0 pointer-events-none"
                )}
              >
                Folytasd ott, ahol abbahagytad, vagy kezdj egy új kalandot!
              </span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Felhasználónév</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="john.doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div
                className={cn(
                  "grid gap-2 h-0 opacity-0 -my-4 transition-[height,opacity,margin]",
                  signUp &&
                    "h-16 opacity-100 -my-2 transition-[height,opacity,margin]"
                )}
              >
                <Label htmlFor="email">Becenév</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="John Doe"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required={signUp}
                  tabIndex={!signUp ? -1 : undefined}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Jelszó</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            {signUp ? (
              <>
                <Button type="submit" className="w-full">
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <UserPlus />
                  )}
                  Regisztráció
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setSignUp(false)}
                >
                  <LogIn />
                  Bejelentkezés
                </Button>
              </>
            ) : (
              <>
                <Button type="submit" className="w-full">
                  {loading ? <Loader2 className="animate-spin" /> : <LogIn />}
                  Bejelentkezés
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setSignUp(true)}
                >
                  <UserPlus />
                  Regisztráció
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </form>

      <span className="text-muted-foreground text-sm">
        Made by <b>{"${csapatnev}"}</b>
      </span>
    </div>
  );
}
