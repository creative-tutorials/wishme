import { SidebarProps } from "@/app/types/dash";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CreditCard, History } from "lucide-react";
import { Users, User, BarChart2, Plus, Gem, LogOut } from "lucide-react";

type HeaderProps = SidebarProps;

export function Header({ isSignedIn, imageUrl, fullName }: HeaderProps) {
  const router = useRouter();
  return (
    <div
      id="header"
      className="fixed top-0 left-0 w-full p-4 bg-[#080809]/50 backdrop-blur border-b border-zinc-800 z-10 md:hidden lg:hidden flex items-center justify-between"
    >
      <div id="logo">
        <Image
          src="/wishme logo.png"
          width={30}
          height={30}
          alt="wishme logo"
        />
      </div>
      <div id="links" className="flex gap-8">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/profile">
                <History className="w-5 h-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>List Hisotry</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/analytics">
                <BarChart2 className="w-5 h-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Analytics</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div id="profile" className="">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Image
              src={isSignedIn ? (imageUrl as string) : "/vercel.svg"}
              width={30}
              height={30}
              alt={isSignedIn ? (fullName as string) : "Vercel"}
              className="rounded-full cursor-pointer w-12 h-12 object-cover"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-zinc-950 border border-zinc-800">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="w-auto h-[0.01rem] bg-gray-600" />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="bg-transparent cursor-pointer focus:bg-zinc-900"
                onClick={() => router.push("/account")}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="bg-transparent cursor-pointer focus:bg-zinc-900">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="bg-transparent cursor-pointer focus:bg-zinc-900"
                onClick={() => router.push("/team")}
              >
                <Users className="mr-2 h-4 w-4" />
                <span>Team</span>
                <DropdownMenuShortcut className="flex items-center gap-1">
                  <Gem className="w-3 h-3" /> Pro
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <SignOutButton>
                <DropdownMenuItem className="bg-transparent cursor-pointer focus:bg-red-600 focus:text-red-200 text-red-300">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </SignOutButton>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
