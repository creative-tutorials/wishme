"use client";

import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/main/account/sidebar";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Profile } from "@/components/layout/main/account/profile";
import { UserRound, PiggyBank, BellDot, Home } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [isModal, setIsModal] = useState(false);
  const [userX, setUser] = useState({
    name: "",
    username: "",
    email: "",
    imageUrl: "",
  });
  const { user } = useUser();

  useEffect(() => {
    const userObj = user || {
      fullName: "",
      username: "",
      emailAddresses: [],
      imageUrl: "",
    };

    const timer = setTimeout(() => {
      setIsLoading(false);
      setUser({
        name: userObj.fullName || "",
        username: userObj.username || "",
        email: userObj.emailAddresses[0]?.emailAddress || "",
        imageUrl: userObj.imageUrl || "",
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [user]);

  if (isLoading) {
    return <p>Loading ...</p>;
  }

  return (
    <>
      <main className="w-full h-screen md:flex lg:flex">
        <Sidebar />
        <Content setIsModal={setIsModal} userX={userX} />

        <Footer />
        {isModal && <Profile setIsModal={setIsModal} />}
      </main>
    </>
  );
}

function Footer() {
  return (
    <footer className="md:hidden lg:hidden block fixed bottom-12 left-1/2 right-1/2 -translate-x-1/2 translate-y-1/2 w-full max-w-sm rounded-md bg-zinc-950 border border-zinc-800 shadow-md p-5">
      <div id="icons" className="flex items-center justify-between">
        <div id="icon">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/account">
                  <UserRound className="w-8" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Account</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div id="icon">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/account/budget">
                  <PiggyBank className="w-8" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Budget</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div id="icon">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/account/notifications">
                  <BellDot className="w-8" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div id="icon">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/">
                  <Home className="w-8" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Home</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </footer>
  );
}

function Content(props: {
  userX: {
    imageUrl: string | StaticImport;
    name: string;
    email: string | undefined;
  };
  setIsModal: (arg0: boolean) => void;
}) {
  return (
    <div id="page" className="p-10 w-full">
      <section id="account-management">
        <hgroup className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium">Account Management</h1>
          <span>Manage your account settings and preferences</span>
        </hgroup>
        <div
          id="context"
          className="flex md:flex-row lg:flex-row flex-col gap-4 mt-4 w-full"
        >
          <div id="image" className="">
            <Image
              src={props.userX.imageUrl}
              width={30}
              height={30}
              alt={props.userX.name}
              className="rounded-full object-cover w-40 h-40 max-w-none"
              unoptimized // Disable image optimization
            />
          </div>
          <div id="xyz" className="flex flex-col gap-3 w-full">
            <div id="email" className="flex flex-col gap-4 w-full">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                placeholder="Email"
                className="w-full"
                defaultValue={props.userX.email}
                disabled
              />
            </div>
            <div id="name" className="flex flex-col gap-4 w-full">
              <Label htmlFor="username">Name</Label>
              <Input
                type="text"
                placeholder="Name"
                defaultValue={props.userX.name}
                className="w-full"
                disabled
              />
            </div>
            <div id="call-to-action" className="flex items-end justify-end">
              <Button
                className="x bg-indigo-600 hover:bg-indigo-700"
                onClick={() => props.setIsModal(true)}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
