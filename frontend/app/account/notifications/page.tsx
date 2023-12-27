"use client";

import { isMobile } from "@/hooks/device-detect";
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/main/account/account-sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

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
                <section id="notifications">
                  <hgroup className="flex flex-col gap-2">
                    <h1 className="text-2xl font-medium">Notifications</h1>
                    <span>
                      Update your notifications settings and preferences
                    </span>
                  </hgroup>
                </section>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      )}
    </>
  );
}
