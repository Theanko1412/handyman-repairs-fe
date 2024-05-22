import { useState } from "react";
import { Link } from "react-router-dom";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./mode-toggle";
import { useAuth } from "./AuthContext";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { z } from "zod";
import Login from "./Login";

export default function Header() {
  const { isLoggedIn, logout } = useAuth();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-16 px-4 md:px-6 border-b backdrop-blur-3xl bg-white/70 border border-zinc-200 bg-white text-zinc-950 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
      <Link className="flex items-center gap-2 text-lg font-semibold" to="/">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-paint-roller"
        >
          <rect width="16" height="6" x="2" y="2" rx="2" />
          <path d="M10 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect width="4" height="6" x="8" y="16" rx="1" />
        </svg>
        <div className="text-lg">
          <span>Handyman Repairs</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-wrench"
        >
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      </Link>
      {isLoggedIn && (
        <nav className="hidden md:flex items-center gap-14 text-md font-medium">
          <Link className="hover:underline" to="/category">
            Categories
          </Link>
          <Link className="hover:underline" to="/handyman">
            Handymen
          </Link>
          <Link className="hover:underline" to="/service">
            Services
          </Link>
        </nav>
      )}
      {isLoggedIn ? (
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9">
                <AvatarImage alt="@shadcn" src="/placeholder-avatar.jpg" />
                <AvatarFallback>
                  {user?.firstName.charAt(0).toUpperCase()}
                  {user?.lastName.charAt(0).toUpperCase()}
                </AvatarFallback>
                <span className="sr-only">Toggle user menu</span>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link to="/account">Account</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
      ) : (
        <div className="flex gap-2">
          <Login />
          <ModeToggle />
        </div>
      )}
    </header>
  );
}
