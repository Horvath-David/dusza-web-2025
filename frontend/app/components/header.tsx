import {
  ChevronsUpDown,
  Loader2,
  LogOut,
  Swords,
  WandSparkles,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router";
import { MenuToggleIcon } from "~/components/menu-toggle-icon";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { UserContext } from "~/context/UserContext";
import { cn } from "~/lib/utils";
import { Logo } from "./Logo";
import { API_URL } from "~/constants";
import type { UserMe } from "~/models";

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const navigate = useNavigate();

  const isPlayer = window.location.pathname.startsWith("/app/player");
  const isMaster = window.location.pathname.startsWith("/app/master");

  const links = [
    {
      label: "Features",
      href: "#",
    },
    {
      label: "Pricing",
      href: "#",
    },
    {
      label: "About",
      href: "#",
    },
  ];

  async function handleLogout() {
    setLogoutLoading(true);
    await fetch(`${API_URL}/auth/logout`, {
      method: "GET",
      credentials: "include",
    });
    navigate("/");
    setLogoutLoading(false);
  }

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b border-border")}>
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <Link
          to="/app"
          className={buttonVariants({
            variant: "ghost",
            size: "lg",
            className: "text-[1rem] px-2!",
          })}
        >
          <Logo />
        </Link>
        <div className="hidden items-center gap-2 md:flex">
          {/* {links.map((link, i) => (
            <a
              className={buttonVariants({ variant: "ghost" })}
              href={link.href}
              key={i}
            >
              {link.label}
            </a>
          ))} */}

          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg flex items-center justify-center font-bold w-full h-full bg-linear-to-br from-blue-400 to-violet-500">
                      <span>{user.display_name.slice(0, 2).toUpperCase()}</span>
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user.display_name}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                align="center"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg flex items-center justify-center font-bold w-full h-full bg-linear-to-br from-blue-400 to-violet-500">
                        <span>
                          {user.display_name.slice(0, 2).toUpperCase()}
                        </span>
                      </AvatarFallback>{" "}
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {user.display_name}
                      </span>
                      <span className="truncate text-muted-foreground text-xs">
                        @{user.username}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  {logoutLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <LogOut />
                  )}
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {isMaster && (
            <Link
              className={buttonVariants({ variant: "outline" })}
              to="/app/player"
            >
              <Swords />
              Váltás játékos nézetre
            </Link>
          )}
          {isPlayer && (
            <Link
              className={buttonVariants({ variant: "outline" })}
              to="/app/master"
            >
              <WandSparkles />
              Váltás játékmester nézetre
            </Link>
          )}
        </div>
        <Button
          aria-controls="mobile-menu"
          aria-expanded={open}
          aria-label="Toggle menu"
          className="md:hidden"
          onClick={() => setOpen(!open)}
          size="icon"
          variant="outline"
        >
          <MenuToggleIcon className="size-5" duration={300} open={open} />
        </Button>
      </nav>
      <MobileMenu className="flex flex-col justify-between gap-2" open={open}>
        <div className="grid gap-y-2">
          {links.map((link) => (
            <a
              className={buttonVariants({
                variant: "ghost",
                className: "justify-start",
              })}
              href={link.href}
              key={link.label}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Button className="w-full bg-transparent" variant="outline">
            Sign In
          </Button>
          <Button className="w-full">Get Started</Button>
        </div>
      </MobileMenu>
    </header>
  );
}

type MobileMenuProps = React.ComponentProps<"div"> & {
  open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
  if (!open || typeof window === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className={cn(
        "bg-background/95 backdrop-blur-lg supports-backdrop-filter:bg-background/50",
        "fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y md:hidden"
      )}
      id="mobile-menu"
    >
      <div
        className={cn(
          "data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
          "size-full p-4",
          className
        )}
        data-slot={open ? "open" : "closed"}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
