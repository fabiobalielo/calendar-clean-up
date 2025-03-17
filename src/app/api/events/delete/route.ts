import { getServerSession } from "next-auth/next";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { eventIds } = await request.json();

    if (!eventIds || !Array.isArray(eventIds) || eventIds.length === 0) {
      return NextResponse.json(
        { error: "No event IDs provided" },
        { status: 400 }
      );
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: session.accessToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const results = await Promise.allSettled(
      eventIds.map((eventId) =>
        calendar.events.delete({
          calendarId: "primary",
          eventId,
        })
      )
    );

    const succeeded = results.filter(
      (result) => result.status === "fulfilled"
    ).length;
    const failed = results.filter(
      (result) => result.status === "rejected"
    ).length;

    return NextResponse.json({
      message: `Deleted ${succeeded} events, failed to delete ${failed} events`,
      succeeded,
      failed,
    });
  } catch (error) {
    console.error("Error deleting events:", error);
    return NextResponse.json(
      { error: "Failed to delete events" },
      { status: 500 }
    );
  }
}
