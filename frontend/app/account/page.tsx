"use client";

import { isMobile } from "@/hooks/device-detect";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/main/account/account-sidebar";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Profile } from "@/components/layout/main/account/profile";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [isModal, setIsModal] = useState(false);
  const [userX, setUserX] = useState({
    name: "",
    username: "",
    email: "",
    imageUrl: "",
  });
  const { user } = useUser();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setUserX({
        name: user?.fullName || "",
        username: user?.username || "",
        email: user?.emailAddresses[0]?.emailAddress || "",
        imageUrl: user?.imageUrl || "",
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [
    setIsLoading,
    user?.emailAddresses,
    user?.fullName,
    user?.imageUrl,
    user?.username,
  ]);

  return (
    <>
      {isLoading ? (
        <p>Loading ...</p>
      ) : (
        <main className="w-full h-screen">
          <ResizablePanelGroup
            direction="horizontal"
            className="w-full h-full rounded-lg"
          >
            <ResizablePanel defaultSize={25}>
              <Sidebar />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={75}>
              <div id="page" className="p-10 w-full">
                <section id="account-management">
                  <hgroup className="flex flex-col gap-2">
                    <h1 className="text-2xl font-medium">Account Management</h1>
                    <span>Manage your account settings and preferences</span>
                  </hgroup>
                  <div id="context" className="flex flex-col gap-4 mt-4">
                    <div id="image" className="x w-24 h-24">
                      <Image
                        src={userX.imageUrl}
                        width={100}
                        height={100}
                        alt={userX.name}
                        className="rounded-full object-cover w-full h-full"
                      />
                    </div>
                    <div id="email" className="flex gap-2 items-center">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        type="email"
                        placeholder="Email"
                        defaultValue={userX.email}
                        disabled
                      />
                    </div>
                    <div id="name" className="flex gap-2 items-center">
                      <Label htmlFor="username">Name</Label>
                      <Input
                        type="text"
                        placeholder="Name"
                        defaultValue={userX.name}
                        disabled
                      />
                    </div>
                    <div
                      id="call-to-action"
                      className="flex items-end justify-end"
                    >
                      <Button
                        className="x bg-indigo-600 hover:bg-indigo-700"
                        onClick={() => setIsModal(true)}
                      >
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </section>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>

          {isModal && <Profile setIsModal={setIsModal} />}
        </main>
      )}
    </>
  );
}
