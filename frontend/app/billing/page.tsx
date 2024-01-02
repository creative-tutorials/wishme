"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import {
  BarChart2,
  CreditCard,
  Settings,
  LayoutDashboard,
  History,
  User,
  Users,
  Gem,
  Command,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export default function Billing() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  type KeyboardEvent2 = {
    key: string;
    metaKey: boolean;
    ctrlKey: boolean;
    preventDefault: () => void;
  };

  useEffect(() => {
    const down = (e: KeyboardEvent2) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <main className="md:p-10 lg:p-10 p-4">
      <p className="text-sm text-muted-foreground text-right md:block lg:block hidden">
        Press{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-zinc-500 bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </p>
      <div
        id="search"
        className="md:hidden lg:hidden flex items-end justify-end"
      >
        <Command onClick={() => setOpen((open) => !open)} />
      </div>
      <div id="center" className="mt-4">
        <div
          id="plan"
          className="w-full bg-[#1c1941] border-2 border-[#4b39ef] p-4 rounded-md"
        >
          <div id="group" className="flex flex-col gap-4">
            <div id="text-content">
              <hgroup className="flex justify-between">
                <h1 className="text-xl font-medium">Basic Plan</h1>
                <h2 className="text-2xl font-semibold">$0/mo</h2>
              </hgroup>
              <span className="x text-neutral-200 md:text-base lg:text-base text-sm">
                Free plan for the basic functionality
              </span>
            </div>

            <div id="btn">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-[#4e39f9] hover:bg-[#4e3cdb]">
                    Change Plan
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="x bg-zinc-950 border border-zinc-900">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Pro Plan is coming soon</AlertDialogTitle>
                    <AlertDialogDescription>
                      We are rolling out a pro plan soon. So for now you can use
                      the free plan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="hover:bg-zinc-800 border-zinc-800">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction className="bg-white hover:bg-slate-200 text-black">
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
        <Separator className="w-full h-[0.01rem] bg-gray-700 my-10" />
        <div
          id="billing"
          className="p-4 bg-zinc-950 border border-zinc-800 rounded-md mt-10 shadow-md"
        >
          <hgroup>
            <h1 className="text-3xl font-semibold">Billing information</h1>
          </hgroup>
          <div
            id="info"
            className="flex md:flex-nowrap lg:flex-nowrap flex-wrap gap-4 w-full mt-4"
          >
            <div
              id="payment-card"
              className="border border-zinc-700 p-4 rounded-md w-full"
            >
              <hgroup>
                <h3 className="text-lg font-medium">Payment Method</h3>
              </hgroup>
              <div id="card" className="flex flex-col gap-4 mt-4">
                <hgroup>
                  <span className="x text-neutral-400">Card Information</span>
                  <p className="font-medium">Mastercard ending in 4592</p>
                </hgroup>
                <hgroup>
                  <span className="x text-neutral-400">Name on card</span>
                  <p className="font-medium">Wishme.co</p>
                </hgroup>
              </div>
            </div>
            <div
              id="billing-card"
              className="border border-zinc-700 p-4 rounded-md w-full"
            >
              <hgroup>
                <h3 className="text-lg font-medium">Billing Details</h3>
              </hgroup>
              <div id="card" className="flex flex-col gap-4 mt-4">
                <hgroup>
                  <span className="x text-neutral-400">Next Billing Date</span>
                  <p className="font-medium">Jan. 20, 2023</p>
                </hgroup>
                <hgroup>
                  <span className="x text-neutral-400">Billing Address</span>
                  <p className="font-medium">
                    21310 Amesbury Meadow Ln Spring, Texas(TX), 77379
                  </p>
                </hgroup>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <Link href="/">
              <CommandItem>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </CommandItem>
            </Link>
            <Link href="/history">
              <CommandItem>
                <History className="mr-2 h-4 w-4" />
                <span>List History</span>
              </CommandItem>
            </Link>
            <Link href="/analytics">
              <CommandItem>
                <BarChart2 className="mr-2 h-4 w-4" />
                <span>Analytics</span>
              </CommandItem>
            </Link>
          </CommandGroup>
          <CommandSeparator className="x bg-zinc-700/50" />
          <CommandGroup heading="Settings">
            <Link href="/account">
              <CommandItem>
                <User className="mr-2 h-4 w-4" />
                <span>Account</span>
                <CommandShortcut className="text-neutral-500">
                  ⌘P
                </CommandShortcut>
              </CommandItem>
            </Link>
            <Link href="/billing">
              <CommandItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
                <CommandShortcut className="text-neutral-500">
                  ⌘B
                </CommandShortcut>
              </CommandItem>
            </Link>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </main>
  );
}
