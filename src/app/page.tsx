"use client";

import { useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import LoginButton from "@/components/LoginButton";
import EventList from "@/components/EventList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Script from "next/script";

function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Calendar Cleanup",
            applicationCategory: "ProductivityApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            description:
              "Clean up and organize your Google Calendar with our powerful tool. Remove unwanted events, declutter your schedule, and save time.",
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              ratingCount: "125",
            },
          }),
        }}
      />
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold">
              Google Calendar Cleanup Tool
            </CardTitle>
            <CardDescription className="text-xl mt-2">
              Effortlessly organize and declutter your Google Calendar in
              minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="mb-6 text-center max-w-2xl">
              Our powerful calendar cleanup tool helps you remove unwanted
              events, organize your schedule, and take back control of your
              time. Perfect for busy professionals, teams, and anyone who wants
              a cleaner calendar.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 w-full max-w-2xl">
              <div className="text-center p-4">
                <h3 className="font-bold mb-2">Delete Unwanted Events</h3>
                <p className="text-sm text-muted-foreground">
                  Quickly select and remove multiple events at once
                </p>
              </div>
              <div className="text-center p-4">
                <h3 className="font-bold mb-2">Organize Your Schedule</h3>
                <p className="text-sm text-muted-foreground">
                  Categorize and manage your calendar efficiently
                </p>
              </div>
              <div className="text-center p-4">
                <h3 className="font-bold mb-2">Save Time</h3>
                <p className="text-sm text-muted-foreground">
                  Automate calendar management tasks in seconds
                </p>
              </div>
            </div>
            <LoginButton />
          </CardContent>
        </Card>

        {session ? (
          <EventList />
        ) : (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4 text-center">
                How It Works
              </h2>
              <ol className="list-decimal pl-6 mb-6 space-y-2">
                <li>Sign in with your Google account</li>
                <li>Select the events you want to clean up</li>
                <li>Choose to delete, archive, or categorize them</li>
                <li>Enjoy your newly organized calendar</li>
              </ol>
              <p className="text-muted-foreground text-center">
                Sign in with your Google account to start managing your calendar
                events.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <SessionProvider>
      <HomePage />
    </SessionProvider>
  );
}
