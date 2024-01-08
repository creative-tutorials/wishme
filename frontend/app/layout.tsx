import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";

import { Inter } from "next/font/google";
import "./globals.css";
import { dark } from "@clerk/themes";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Expi",
  applicationName: "expi",
  description: "A simple expense tracker to help you save money.",
  keywords: [
    "expro",
    "expro",
    "cart",
    "expense tracker",
    "next.js",
    "save money",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  openGraph: {
    images: [
      "https://res.cloudinary.com/derbreilm/image/upload/v1703724471/MetaOG_Image_ybcojw.png",
    ],
    url: "https://app-wishme.vercel.app",
  },
};

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#7148FC",
          borderRadius: "3px",
          colorBackground: "#0d0d0e",
        },
      }}
      publishableKey={clerkPubKey}
    >
      <html lang="en">
        <body className={inter.className}>
          {children} <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
