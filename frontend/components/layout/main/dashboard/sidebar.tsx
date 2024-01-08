import { SidebarProps } from "@/app/types/dash";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CreditCard } from "lucide-react";
import { User, BarChart2, LogOut } from "lucide-react";

export function Sidebar({ isSignedIn, imageUrl, fullName }: SidebarProps) {
  const router = useRouter();
  return (
    <div
      id="sidebar"
      className="fixed top-0 left-0 h-screen bg-zinc-950 border-r border-neutral-800 p-9 md:flex lg:flex hidden flex-col items-center gap-4 z-10"
    >
      <div id="logo">
        <Image src="/icon.png" width={30} height={30} alt="wishme logo" />
      </div>
      <div id="links" className="flex flex-col gap-8">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/analytics">
                <BarChart2 />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Analytics</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div id="profile" className="mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage
                src={isSignedIn ? (imageUrl as string) : "/vercel.svg"}
                alt="@shadcn"
              />
              <AvatarFallback>
                {isSignedIn && (fullName?.substring(0, 2) as string)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-zinc-950 border border-zinc-700/50">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="w-auto h-[0.01rem] bg-zinc-700/50" />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="bg-transparent cursor-pointer focus:bg-zinc-900"
                onClick={() => router.push("/account")}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="bg-transparent cursor-pointer focus:bg-zinc-900"
                onClick={() => router.push("/billing")}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="w-auto h-[0.01rem] bg-zinc-700/50" />
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
