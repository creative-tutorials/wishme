"use client";

import { Protect } from "@clerk/nextjs";
import { TeamErr } from "@/components/layout/main/team-fallback";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export default function Team() {
  const { isSignedIn, user } = useUser();
  const [isProtected, setIsProtected] = useState(true);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount((prev) => prev + 1);

    count === 1 && checkOrgRole();

    async function checkOrgRole() {
      setLoading(true);
      if (!isSignedIn) return;

      if (user.organizationMemberships.length === 0) {
        setLoading(false);
        setIsProtected(true);
        return;
      }

      console.log(user.organizationMemberships);

      if (
        user?.organizationMemberships[0].role ===
        process.env.NEXT_PUBLIC_ORG_KEY
      ) {
        setLoading(false);
        setIsProtected(false);
      } else {
        setLoading(false);
        setIsProtected(false);
      }
    }

    return () => {
      setCount(0);
    };
  }, [count, isSignedIn, user, loading]);

  return (
    <main className="w-full">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {isProtected ? (
            <div className="flex items-center justify-center min-h-screen">
              <TeamErr />
            </div>
          ) : (
            <h1>Welcome Subscriber</h1>
          )}
        </div>
      )}
    </main>
  );
}
