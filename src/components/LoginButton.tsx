"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LoginButton() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  if (isLoading) {
    return (
      <Button disabled variant="outline" className="w-full md:w-auto">
        Loading...
      </Button>
    );
  }

  if (session) {
    return (
      <Button
        onClick={() => signOut()}
        variant="destructive"
        className="w-full md:w-auto cursor-pointer"
      >
        Sign Out
      </Button>
    );
  }

  return (
    <Button
      onClick={() => signIn("google")}
      className="w-full md:w-auto flex items-center gap-2 cursor-pointer bg-blue-500"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="currentColor"
        className="shrink-0"
      >
        <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
      </svg>
      Sign in with Google
    </Button>
  );
}
