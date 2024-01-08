import Link from "next/link";
import { Home } from "lucide-react";

export function Sidebar() {
  return (
    <div
      id="sidebar"
      className="p-10 bg-[#080809] border-r border-zinc-900 w-full max-w-72 h-full md:flex lg:flex flex-col hidden gap-4"
    >
      <div id="top-side" className="w-full h-full flex flex-col gap-4">
        <div id="general">
          <hgroup>
            <h1 className="text-2xl font-medium px-4">General</h1>
          </hgroup>
          <div id="links" className="flex flex-col gap-2 mt-4 w-full">
            <Link
              href="/account"
              className="p-1 px-4 transition-all w-full hover:bg-zinc-900 rounded-md hover:underline"
            >
              Account
            </Link>
            <Link
              href="/account/budget"
              className="p-1 px-4 transition-all w-full hover:bg-zinc-900 rounded-md hover:underline"
            >
              Budget
            </Link>
          </div>
        </div>
        <div id="extras">
          <hgroup>
            <h1 className="text-2xl font-medium px-4">Extras</h1>
          </hgroup>
          <div id="links" className="flex flex-col gap-2 mt-4 w-full">
            <Link
              href="/account/notifications"
              className="p-1 px-4 transition-all w-full hover:bg-zinc-900 rounded-md hover:underline"
            >
              Notifications
            </Link>
          </div>
        </div>
      </div>
      <div id="bottom-side" className="m-auto">
        <Link href="/">
          {" "}
          <Home />
        </Link>
      </div>
    </div>
  );
}
