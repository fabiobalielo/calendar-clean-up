"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface Event {
  id: string;
  summary: string;
  start: {
    dateTime: string;
    date?: string;
  };
  end: {
    dateTime: string;
    date?: string;
  };
}

type SortField = "summary" | "start" | "end";
type SortDirection = "asc" | "desc";

export default function EventList() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("start");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  useEffect(() => {
    const fetchEvents = async () => {
      if (status !== "authenticated" || !session) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch("/api/events");

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API error:", errorData);
          throw new Error(
            `Failed to fetch events: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Events data:", data);
        setEvents(data.events || []);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [session, status]);

  const handleSelectAll = () => {
    if (selectedEvents.length === filteredEvents.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(filteredEvents.map((event) => event.id));
    }
  };

  const handleSelectEvent = (eventId: string) => {
    if (selectedEvents.includes(eventId)) {
      setSelectedEvents(selectedEvents.filter((id) => id !== eventId));
    } else {
      setSelectedEvents([...selectedEvents, eventId]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedEvents.length === 0) return;

    try {
      setIsDeleting(true);
      const toastId = toast.loading("Deleting events...");

      const response = await fetch("/api/events/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventIds: selectedEvents }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete events");
      }

      const result = await response.json();
      toast.dismiss(toastId);
      toast.success(result.message);

      // Remove deleted events from the list
      setEvents(events.filter((event) => !selectedEvents.includes(event.id)));
      setSelectedEvents([]);
    } catch (err) {
      toast.dismiss(); // Dismiss any loading toasts
      toast.error("Failed to delete events. Please try again.");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getEventStartTime = (event: Event) => {
    return event.start.dateTime ? new Date(event.start.dateTime).getTime() : 0;
  };

  const getEventEndTime = (event: Event) => {
    return event.end.dateTime ? new Date(event.end.dateTime).getTime() : 0;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return "↕️";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    // First filter by search query
    const filtered = events.filter((event) => {
      const summary = (event.summary || "").toLowerCase();
      const query = searchQuery.toLowerCase();

      // Smart search: check if any word in the summary starts with the query
      if (query.trim() === "") return true;

      // Check exact match
      if (summary.includes(query)) return true;

      // Check for word starts with
      const words = summary.split(/\s+/);
      return words.some((word) => word.startsWith(query));
    });

    // Then sort
    return [...filtered].sort((a, b) => {
      const multiplier = sortDirection === "asc" ? 1 : -1;

      if (sortField === "summary") {
        const summaryA = (a.summary || "").toLowerCase();
        const summaryB = (b.summary || "").toLowerCase();
        return summaryA.localeCompare(summaryB) * multiplier;
      } else if (sortField === "start") {
        return (getEventStartTime(a) - getEventStartTime(b)) * multiplier;
      } else if (sortField === "end") {
        return (getEventEndTime(a) - getEventEndTime(b)) * multiplier;
      }

      return 0;
    });
  }, [events, searchQuery, sortField, sortDirection]);

  // Check if any filters are active
  const hasActiveFilters =
    searchQuery !== "" || sortField !== "start" || sortDirection !== "asc";

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 text-center">
          <p>Loading events...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 text-center">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 text-center">
          <p>No upcoming events found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Calendar Events</CardTitle>
        <CardDescription>
          Select events you want to delete from your calendar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="selectAll"
                checked={
                  selectedEvents.length === filteredEvents.length &&
                  filteredEvents.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
              <label
                htmlFor="selectAll"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {selectedEvents.length === filteredEvents.length &&
                filteredEvents.length > 0
                  ? "Deselect All"
                  : "Select All"}
              </label>
            </div>
            <Button
              onClick={handleDeleteSelected}
              disabled={selectedEvents.length === 0 || isDeleting}
              variant="destructive"
              size="sm"
            >
              Delete Selected ({selectedEvents.length})
            </Button>
          </div>

          <div className="relative flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-8"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  ✕
                </Button>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSortField("start");
                setSortDirection("asc");
              }}
              className={`whitespace-nowrap ${
                hasActiveFilters ? "border-blue-500 text-blue-600" : ""
              }`}
              disabled={!hasActiveFilters}
            >
              {hasActiveFilters ? "Reset Filters" : "No Filters"}
            </Button>
          </div>

          {hasActiveFilters && (
            <div className="text-sm text-muted-foreground">
              Active filters:
              {searchQuery && (
                <span className="ml-1 font-medium">
                  Search &quot;{searchQuery}&quot;
                </span>
              )}
              {(sortField !== "start" || sortDirection !== "asc") && (
                <span className="ml-1 font-medium">
                  Sort by {sortField} (
                  {sortDirection === "asc" ? "ascending" : "descending"})
                </span>
              )}
            </div>
          )}
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Select</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("summary")}
                >
                  Event {getSortIcon("summary")}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("start")}
                >
                  Start {getSortIcon("start")}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("end")}
                >
                  End {getSortIcon("end")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No events match your search
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedEvents.includes(event.id)}
                        onCheckedChange={() => handleSelectEvent(event.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {event.summary || "Untitled Event"}
                    </TableCell>
                    <TableCell>
                      {event.start.dateTime
                        ? formatDate(event.start.dateTime)
                        : event.start.date}
                    </TableCell>
                    <TableCell>
                      {event.end.dateTime
                        ? formatDate(event.end.dateTime)
                        : event.end.date}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
