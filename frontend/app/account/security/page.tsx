"use client";

import { isMobile } from "@/hooks/device-detect";
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/main/account/account-sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Link from "next/link";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [setIsLoading]);

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
                <section
                  id="account-management"
                  className="w-full h-full flex flex-col gap-4"
                >
                  <hgroup className="flex flex-col gap-2">
                    <h1 className="text-2xl font-medium">Security</h1>
                    <span>
                      Enable two factor authentication to ensure account
                      security.
                    </span>
                  </hgroup>
                  <div
                    id="info-card"
                    className=" bg-sky-900 border border-sky-700 p-2 rounded-md w-fit"
                  >
                    <hgroup>
                      <p className=" text-sky-200">
                        2FA has been moved to the new account settings page.
                        Click{" "}
                        <Link
                          href="/account#/multi-factor"
                          className="underline"
                        >
                          Enable 2FA
                        </Link>
                      </p>
                    </hgroup>
                  </div>
                </section>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      )}
    </>
  );
}
