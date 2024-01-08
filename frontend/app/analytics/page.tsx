"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Analytics() {
  const [bgColor, setBgColor] = useState("");
  useEffect(() => {
    const colors = [
      "bg-neutral-950",
      "bg-zinc-950",
      "bg-gray-950",
      "bg-slate-800",
      "bg-stone-950",
      "bg-black",
    ]; // Add more dark mode colors if needed
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * colors.length);
      const randomColor = colors[randomIndex];
      setBgColor(randomColor);
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const mainStyle = {
    transition: "background-color 0.5s ease",
  };

  return (
    <main
      className={`w-full flex items-center justify-center min-h-screen flex-col gap-2 ${bgColor}`}
      style={mainStyle}
    >
      <span className="text-2xl font-medium">We&apos;re working on it</span>

      <Link href="/" className="text-purple-400 hover:underline">
        Return to Home
      </Link>
    </main>
  );
}

// function App() {
//   const [bgColor, setBgColor] = useState('');

//   return (
//     <main className={`w-full flex items-center justify-center min-h-screen ${bgColor}`}>
//       <span className="text-2xl">We&apos;re working on it</span>
//     </main>
//   );
// }

// export default App;
